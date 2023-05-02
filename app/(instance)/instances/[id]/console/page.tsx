import {Typography} from "../../../../../components/base"
import ConsoleComponent from "../Console";
import headers, {cookies} from "next/headers";
import lxd from "../../../../../lib/lxd";

export default async function Console(query) {
    let id = query.params.id
    let accessToken = cookies().get("access_token").value;
    let client = lxd(accessToken);
    let instance = await client.instances.instance(id).metadata();
    return (
        <>
        <Typography variant="h4">Console</Typography>
        <ConsoleComponent instance={instance} />
        </>
    )
}