import { Flex, Title } from "@mantine/core";
import CreateRack from "./createRack";
import Rack from "./rack";
import { getRacks } from "@/app/_lib/racks";
import { getPermissions } from "@/app/_lib/permissions";
import  prisma from "@/app/_lib/prisma";
import { getLocation, getLocations } from "@/app/_lib/locations";

export default async function Racks() {
    let permissions = await getPermissions();
    let racks = await getRacks();
    let locations = await getLocations();
    return (
        <>
            <Flex mb="sm">
                <Title order={1} my="auto">
                    Racks
                </Title>
                {permissions.includes("create:rack") ? (
                    <CreateRack locations={locations} />
                ) : null}
            </Flex>
            <div style={{ width: "100%" }}>
                {" "}
                {racks.map((rack) => {
                    return <Rack rack={rack} />;
                })}
            </div>
        </>
    )
}