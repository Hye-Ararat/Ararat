import { RemoteComponent } from "../RemoteComponent";
import nookies from "nookies";
import { useEffect, useState } from "react";
import axios from "axios";


function Widget({ widget, imageId }) {
    let cookies = nookies.get();
    const url = `https://images.ararat.hye.gg/accountServices/image/${imageId}/widget/${widget}?key=${cookies.access_token}&type=ararat`;
    const HelloWorld = ({ name }) => <RemoteComponent url={url} name={name} />;
    return (
        <div>
            <HelloWorld name="TEST" />
        </div>
    )
}

export default function ExtensionWidget({ image, widget }) {
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
        imageId ?
            <Widget imageId={imageId} widget={widget} />
            : ""
    )
}