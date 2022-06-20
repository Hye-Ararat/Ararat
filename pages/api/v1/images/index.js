import decodeToken from "../../../../lib/decodeToken";
import axios from "axios";
import prisma from "../../../../lib/prisma"
import { getUserPermissions } from "../../../../lib/getUserPermissions";
export default async function handler(req, res) {
    const { query: { id, arch }, method } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    let image_servers = []
    console.log(await getUserPermissions(tokenData.id))
    if ((await getUserPermissions(tokenData.id)).includes("list-images")) {
        image_servers = await prisma.imageServer.findMany({})
    } else {
        image_servers = await prisma.imageServer.findMany({
            where: {
                users: {
                    some: {
                        userId: tokenData.id,
                        AND: {
                            permissions: {
                                some: {
                                    permission: "list-images"
                                }
                            }
                        }
                    }
                }
            }
        });
    }

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
        let filtered = Object.keys(img.data.products).filter(key => (arch == "x64" ? img.data.products[key].arch == "amd64" : img.data.products[key].arch == "amd64"));

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