import decodeToken from "../../../../lib/decodeToken";
import axios from "axios";
import prisma from "../../../../lib/prisma"
import Permissions from "../../../../lib/permissions/index.js";
export default async function handler(req, res) {
    const { query: { id, arch }, method } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    let permissions = new Permissions(tokenData.id);
    let image_servers = await prisma.imageServer.findMany({});
    let count = 0;
    let total = image_servers.length;
    function awaitDone() {
        return new Promise(async (resolve, reject) => {
            setInterval(() => {
                if (count == total) return resolve(true);
            }, 10)
        })
    }
    image_servers.forEach(async (server, index) => {
        if (!await permissions.imageServer(server.id).useImages) image_servers.splice(index, 1);
        count++;
    })
    await awaitDone();

    const responses = await axios.all(image_servers.map(server => axios.get(server.url + "/streams/v1/index.json"))).then(axios.spread((...responses) => responses));
    let images = [];

    for (const [i, response] of responses.entries()) {
        let recursiveFindIndex = async (arr, x, start, end) => {
            if (start > end) return false;
            let mid = Math.floor((start + end) / 2);
            if (response.data.index[array[mid]].datatype == "image-downloads") return mid;
            if (arr[mid] > x) return await recursiveFindIndex(arr, x, start, mid - 1);
            return await recursiveFindIndex(arr, x, mid + 1, end);
        }

        let array = Object.keys(response.data.index);

        let index = await recursiveFindIndex(array, id, 0, array.length - 1);

        const img = await axios.get(image_servers[i].url + "/" + response.data.index[array[index]].path);
        console.log(arch)
        let filtered = Object.keys(img.data.products).filter(key => (arch == "x64" || arch == "amd64" ? (img.data.products[key].arch == "amd64" || img.data.products[key].arch == "x86_64") : (img.data.products[key].arch == "arm64" || img.data.products[key].arch == "aarch64")));

        let filtered_imgs = {};
        filtered.forEach(key => {
            let os = img.data.products[key].os;
            let release_title = img.data.products[key].release_title;
            let release_version = img.data.products[key].release_version;
            let release_codename = img.data.products[key].release_codename;
            let found = false;
            if (img.data.products[key].variant) {
                let variant = img.data.products[key].variant;

                if (variant != "cloud") {
                    filtered.forEach(key2 => {
                        if (img.data.products[key2].variant == "cloud") {
                            if (img.data.products[key2].os == os && img.data.products[key2].release_title == release_title && img.data.products[key2].release_version == release_version && img.data.products[key2].release_codename == release_codename) {
                                found = true;
                                filtered_imgs[key2] = img.data.products[key2];
                            }
                        }
                    })
                } else {
                    found = true;
                    filtered_imgs[key] = img.data.products[key];
                }
            } else {
                found = true;
                filtered_imgs[key] = img.data.products[key];
            }
            if (!found) {
                filtered_imgs[key] = img.data.products[key];
            }

        });


        images.push({
            server: {
                id: image_servers[i].id,
                name: image_servers[i].name
            },
            images: filtered_imgs
        })

    }
    res.send(images)
}