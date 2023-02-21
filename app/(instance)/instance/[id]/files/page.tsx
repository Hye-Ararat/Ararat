import {Grid, Typography} from "../../../../../components/base";
import FilesTable from "./FilesTable"
import {getInstanceFile} from "../../../../../scripts/api/v1/instances/[id]/files";
import {cookies} from "next/headers";
import FileEditor from "./FileEditor";
import NewFile from "./NewFile"
import UploadFile from "./UploadFile";

export default async function Files({params, searchParams}) {
    let files = await getInstanceFile(params.id, searchParams.path || "/", cookies().get("authorization").value);
    return (
        <>
        <Grid container>
        <Typography variant="h4">Files</Typography>
        <UploadFile id={params.id} path={searchParams.path || "/"} />
        <NewFile id={params.id} path={searchParams.path || "/"} />
        </Grid>
        {typeof files == "string" ?
        
        <FileEditor file={files} path={searchParams.path} instance={params.id} /> 
    
        : 
         <FilesTable id={params.id} path={searchParams.path || "/"} files={files} />}

        </>
    )
}