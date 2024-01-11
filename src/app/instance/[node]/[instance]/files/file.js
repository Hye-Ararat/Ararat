"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function File({ node, path, file, instance, accessToken }) {
    const [fileMetadata, setFileMetadata] = useState(null);
    console.log(node)
    useEffect(() => {
        async function run() {
            let heads = await axios.patch(`/api/instances/${node.name}/${instance.name}/files?path=${path}/${file}`, undefined, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Incus-oidc": "true"
                }
            })
            setFileMetadata(heads.data.headers);
            axios.get(`/api/instances/${node.name}/${instance.name}/files?path=${path}/${file}`).then(res => {
                setFileMetadata(res.data)
            }).catch(err => {
                console.log(err)
            })
        }
        run()
    }, [])



    return (
        <p>{file + " " + JSON.stringify(fileMetadata)}</p>
    )
}