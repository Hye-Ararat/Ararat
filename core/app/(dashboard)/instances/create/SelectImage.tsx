"use client";

import { DialogTitle, Typography, Skeleton, DialogContent, Fade } from "../../../../components/base";
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../../../../components/table";

export default function SelectImage({ imageServers, setImage }) {
    const [images, setImages] = useState([]);
    const [formattedImages, setFormattedImages] = useState(null);

    useEffect(() => {

        console.log(formattedImages)

    }, [formattedImages])
    useEffect(() => {
        let imgs = [];
        console.log("asdlfkjas;ldkfj")
        async function run() {
            const responses = await axios.all(imageServers.map(server => axios.get(server.url + "/streams/v1/index.json"))).then(axios.spread((...responses) => responses));
            let imgas = {};
            for (const [i, response] of responses.entries()) {
                let recursiveFindIndex = async (arr, start, end) => {
                    if (start > end) return false;
                    let mid = Math.floor((start + end) / 2);
                    if (response.data.index[array[mid]].datatype == "image-downloads") return mid;
                    return await recursiveFindIndex(arr, mid + 1, end);
                }
                let array = Object.keys(response.data.index);
                let index = await recursiveFindIndex(array, 0, array.length - 1);
                const imgList = await axios.get(imageServers[i].url + "/" + response.data.index[array[index]].path);
                console.log(imgList.data.products)
                Object.keys(imgList.data.products).forEach(img => {
                    imgas[img] = imgList.data.products[img];
                })
                imgs.push({
                    server: {
                        id: imageServers[i].id,
                        name: imageServers[i].name
                    },
                    images: imgas
                })
                setImages(imgs);
            }
        let formatted = [];
        Object.keys(imgs[0].images).map((image, index) => {
            let imageData = imgs[0].images[image];
            console.log("an image has been pushed")
            formatted.push([
                <Typography onClick={() => setImage(imageData)} key={index} sx={{m: "auto", cursor: "pointer"}} fontWeight="bold">{imageData.os + " " + imageData.release_title}</Typography>,
                                <Typography onClick={() => setImage(imageData)} key={index} sx={{m: "auto", cursor: "pointer"}} fontWeight="bold">test</Typography>,
                                                <Typography onClick={() => setImage(imageData)} key={index} sx={{m: "auto", cursor: "pointer"}} fontWeight="bold">test</Typography>

            ]
            )
        })
        console.log(formatted)
        setFormattedImages(formatted);
        }
        run();
    }, [])
    return (
        <>
            <DialogTitle sx={{width: 600}}>
                <Typography variant="h6" align="center" fontFamily="Poppins">Select Image</Typography>
            </DialogTitle>
            <DialogContent>
      
       
                {formattedImages ?
                 <Table columns={[
            {
                title: "Name",
                fontWeight: 500,
                sizes: {
                    xs: 4
                }
            },
            {
                title: "Type",
                sizes: {
                    xs: 4
                }
            },
            {
                title: "Server",
                sizes: {
                    xs: 3
                }
            },
            
            ]} rows={formattedImages} />
                : ""}
                {images.length == 0 ? new Array(10).fill(0).map(() => {
                    return (
                        <Skeleton animation="wave" variant="rectangular" sx={{ height: 30, mb: 1 }} />
                    )
                }) : ""}
            </DialogContent>

        </>
    )
}