import { RemoteComponent } from "../RemoteComponent";
import nookies from "nookies";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Fade, Grid, Typography } from "@mui/material";


function Extension({ extension, imageId }) {
    let cookies = nookies.get();
    const url = `https://images.ararat.hye.gg/accountServices/image/${imageId}/extension/${extension}?key=${cookies.access_token}&type=ararat`;
    const HelloWorld = ({ name }) => <RemoteComponent url={url} name={name} />;
    return (
        <HelloWorld name="TEST" />
    )
}

export default function ExtensionPage({ image, extension }) {
    console.log(image, "this is the image")
    let imageData = {
        architecture: image["image.architecture"],
        os: image["image.os"],
        release: image["image.release"],
        variant: image["image.variant"],
    }
    const [imageId, setImageId] = useState(null);
    useEffect(() => {
        async function image() {
            try {
                let img = await axios.get(`https://images.ararat.hye.gg/findImageId?os=${imageData.os}&release=${imageData.release}&architecture=${imageData.architecture}&variant=${imageData.variant}`)
                setImageId(img.data.id)
            } catch (error) {

            }

        }
        image()
    }, [])
    return (
        <>

            {imageId ?
                <Extension imageId={imageId} extension={extension} />
                :
                <Grid container direction="column">
                    <CircularProgress sx={{ mr: "auto", ml: "auto" }} />
                    <Typography align="center">One moment while we load this experience.</Typography>
                </Grid>}
        </>
    )
}