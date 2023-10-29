"use server";

import { getPermissions } from "./permissions";
import  prisma from "./prisma";
import { validateSession } from "./session";

export async function createLocation(
    locationName,
    locationCountryCode
) {
    await validateSession();
    let permissions = await getPermissions();
    if (!permissions.includes("create:location")) {
        throw new Error("You do not have permission to create a location.");
    }
    let location = await prisma.location.create({
        data: {
            name: locationName,
            countryCode: locationCountryCode
        },
    });
    return location;
}

export async function getLocations() {
    await validateSession();
    let locations = await prisma.location.findMany({});
    let filteredLocations = [];
    for (let location of locations) {
        let permissions = await getPermissions("location", location.id);
        let filteredPermissions = permissions.filter(
            (permission) =>
                permission.includes(":location") &&
                permission !== "create:location"
        );
        if (filteredPermissions.length > 0) {
            filteredLocations.push(location);
        }
    }
    return filteredLocations;
}

export async function getLocation(locationId) {
    await validateSession();
    let permissions = await getPermissions("location", locationId);
    let filteredPermissions = permissions.filter(
        (permission) =>
            permission.includes(":location") &&
            permission !== "create:location"
    );
    if (filteredPermissions.length == 0) {
        throw new Error("You do not have permission to view this location.");
    }
    let location = await prisma.location.findUnique({
        where: {
            id: locationId,
        },
    });
    return location;
}