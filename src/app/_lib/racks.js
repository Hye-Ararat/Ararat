"use server";

import { getPermissions } from "./permissions";
import  prisma from "./prisma";
import { validateSession } from "./session";

export async function createRack(
    rackName,
    rackDescription,
    rackLocationId
) {
    await validateSession();
    let permissions = await getPermissions();
    if (!permissions.includes("create:rack")) {
        throw new Error("You do not have permission to create a rack.");
    }
    let rack = await prisma.rack.create({
        data: {
        name: rackName,
        description: rackDescription,
        location: {
            connect: {
                id: rackLocationId
            }
        }
    },
    });
    return rack;
}

export async function getRacks() {
    await validateSession();
    let racks = await prisma.rack.findMany({
        include: {
            location: true
        }
    });
    let filteredRacks = [];
    for (let rack of racks) {
        let permissions = await getPermissions("rack", rack.id);
        let filteredPermissions = permissions.filter(
            (permission) =>
                permission.includes(":rack") &&
                permission !== "create:rack"
        );
        if (filteredPermissions.length > 0) {
            filteredRacks.push(rack);
        }
    }
    return filteredRacks;
}

export async function getRack(rackId) {
    await validateSession();
    let permissions = await getPermissions("rack", rackId);
    let filteredPermissions = permissions.filter(
        (permission) =>
            permission.includes(":rack") &&
            permission !== "create:rack"
    );
    if (filteredPermissions.length == 0) {
        throw new Error("You do not have permission to view this rack.");
    }
    let rack = await prisma.rack.findUnique({
        where: {
            id: rackId,
        },
    });
    return rack;
}

export async function getRackUnits(rackId) {
    await validateSession();
    let permissions = await getPermissions("rack", rackId);
    let filteredPermissions = permissions.filter((permission) => {
        return permission.includes(":rackunit") && permission !== "create:rackunit";
    });
    if (filteredPermissions.length == 0) {
        return [];
    }
    let rackUnits = await prisma.rackUnit.findMany({
        where: {
            rackId: rackId,
        },
    });
    return rackUnits;
}
