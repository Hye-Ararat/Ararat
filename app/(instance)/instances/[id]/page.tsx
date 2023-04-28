import {Grid, IconButton, Tooltip, Typography} from "../../../../components/base";
import headers, {cookies} from "next/headers";
import lxd from "../../../../lib/lxd";
import InstanceInfoTop from "./InfoTop";
import Widgets from "./Widgets";

export default async function Instance(query) {
    let id = query.params.id
    let accessToken = cookies().get("access_token").value;
    let client = lxd(accessToken);
    let instance = await client.instances.instance(id).metadata();
    let instanceName = instance.config["user.name"] || instance.name;
    let widgets = instance.config["user.widgets"] ? JSON.parse(instance.config["user.widgets"]) : [];
    return (
        <>
        <Typography sx={{mb: 1}} variant="h4">{instanceName}</Typography>
        <InstanceInfoTop instance={instance} />
        <Widgets instance={instance} widgets={widgets} />
        </>
    )
}