import { Flex, Group, TextInput, Title } from "@mantine/core";
import { getPermissions } from "@/app/_lib/permissions";
import prisma from "@/app/_lib/prisma";
import { getLocations } from "@/app/_lib/locations";
import Location from "./location";
import CreateLocation from "./createLocation";
import { DataTableSearch } from "@/app/_components/datatable";

export default async function Locations() {
    let permissions = await getPermissions();
    let locations = await getLocations();
    return (
        <>
            <Flex mb="sm">
                <Title order={1} my="auto">
                    Locations
                </Title>
                {permissions.includes("create:location") ? (
                    <CreateLocation />
                ) : null}
            </Flex>
            <div style={{ width: "100%" }}>
                {" "}
                {locations.map((location) => {
                    return <Location location={location} />;
                })}
            </div>
        </>
    )
}