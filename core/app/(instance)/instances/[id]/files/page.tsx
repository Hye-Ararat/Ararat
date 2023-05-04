import {Grid, Typography} from "../../../../../components/base";
import FilesTable from "./FilesTable"
import {getInstanceFile} from "../../../../../scripts/api/v1/instances/[id]/files";
import {cookies} from "next/headers";
import FileEditor from "./FileEditor";
import NewFile from "./NewFile"
import UploadFile from "./UploadFile";
import lxd from "../../../../../lib/lxd";
import FileView from "./FileView";

export default async function Files({params, searchParams}) {
    let id = params.id;
    let accessToken = cookies().get("access_token")?.value;
    let client = lxd(accessToken);
    let instance = client.instances.instance(id);
    let instanceData = await instance.metadata(true);
    let files = await instance.getFile(searchParams.path || "/");
    let fileMetadata = [];
    //@ts-ignore
    if (files.metadata.type == "directory") {
    let e = new Promise((resolve, reject) => {
        //@ts-ignore
        if (files.metadata.type == "directory") {
            //@ts-ignore
            files.data.forEach(async (file, index) => {
                let filePath = ((searchParams.path ? searchParams.path : "") + "/" + file).replace("//", "/");
                console.log(filePath, "THE FILE PATH")
                let fileData = await instance.getFile(filePath);
                console.log(fileData, "this is the data")
                //@ts-ignore
                if (fileData.metadata.type == "file") {
                    //@ts-ignore
                    let size = fileData.data.length;
                    //@ts-ignore
                    fileData.metadata["size"] = size;
                }
                //@ts-ignore
                fileData.metadata["name"] = file;
              //@ts-ignore
                fileMetadata.push(fileData.metadata)
                console.log(fileMetadata)
                //@ts-ignore
                if (index == files.data.length - 1) return resolve()
            })
        }  
    })
    await e;
}
    return (
        <>
        <Grid container>
        <Typography variant="h4">Files</Typography>
        <UploadFile id={params.id} path={searchParams.path || "/"} />
        <NewFile id={params.id} path={searchParams.path || "/"} />
        </Grid>
        {/*@ts-ignore*/}
        {files.metadata.type == "file" ?
        <FileView instanceData={instanceData} file={files} path={searchParams.path} instance={params.id} accessToken={accessToken} />
    
        : 
         <FilesTable accessToken={accessToken} id={params.id} path={searchParams.path || "/"} files={fileMetadata} />}

        </>
    )
}