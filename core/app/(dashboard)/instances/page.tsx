import {cookies} from "next/headers"
import lxd from "../../../lib/lxd";
import InstancesTable from "./InstancesTable";
import {Typography, Grid} from "../../../components/base";
import CreateInstance from "./CreateInstance";
import prisma from "../../../lib/prisma";
export default async function Instances() {
    let access_token = cookies().get("access_token")?.value;
    let client = lxd(access_token);
    let instances = await client.getInstances();
    let profiles = await client.getProfiles();
    let storagePools = await client.getStoragePools();
    let networks = await client.getNetworks();
    console.log(networks)
    console.log(storagePools, storagePools)
    console.log(profiles, "profiles");
    let imageServers = await prisma.imageServer.findMany();
    console.log(imageServers)
    return (
        <>
        <Grid container direction="row">
        <Typography variant="h4">Instances</Typography>
        <CreateInstance networks={networks} accessToken={access_token} storagePools={storagePools} profiles={profiles} imageServers={imageServers} />
        </Grid>
        <InstancesTable instances={instances} />
        </>
    )
}