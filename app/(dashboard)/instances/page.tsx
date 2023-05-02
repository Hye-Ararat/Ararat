import {cookies} from "next/headers"
import lxd from "../../../lib/lxd";
import InstancesTable from "./InstancesTable";
import {Typography} from "../../../components/base";
export default async function Instances() {
    let access_token = cookies().get("access_token").value;
    let client = lxd(access_token);
    let instances = await client.getInstances();
    console.log(instances)
    return (
        <>
        <Typography variant="h4">Instances</Typography>
        <InstancesTable instances={instances} />
        </>
    )
}