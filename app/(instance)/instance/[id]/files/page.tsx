import {Typography} from "../../../../../components/base";
import FilesTable from "./FilesTable"
import getInstanceFiles from "../../../../../scripts/api/v1/instances/[id]/files";
import {cookies} from "next/headers";
import FileEditor from "./FileEditor";

export default async function Files({params, searchParams}) {
    let files = await getInstanceFiles(params.id, searchParams.path || "/", cookies().get("authorization").value);
    return (
        <>
        <Typography variant="h4">Files</Typography>
        {typeof files == "string" ?
        
        <FileEditor file={files} path={searchParams.path} instance={params.id} /> 
    
        : 
         <FilesTable id={params.id} path={searchParams.path || "/"} files={files} />}

        </>
    )
}