import {cookies} from "next/headers"
import lxd from "../../../lib/lxd";
import InstancesTable from "./InstancesTable";
export default async function Instances() {
    let access_token = cookies().get("access_token").value;
    let client = lxd(access_token);
    let instances = await client.getInstances();
    console.log(instances)
    return (
        <>
        <p>Instances</p>
        <InstancesTable instances={instances} />
        </>
    )
}