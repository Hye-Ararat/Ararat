"use server";

import { getPermissions } from "./permissions";
import { usePrisma } from "./prisma";
import { validateSession } from "./session";

const prisma = usePrisma();
export async function createOrganization(
  organizationName,
  organizationLogoUrl
) {
  await validateSession();
  let permissions = await getPermissions();
  if (!permissions.includes("create:organization")) {
    throw new Error("You do not have permission to create an organization.");
  }
  let organization = await prisma.organization.create({
    data: {
      name: organizationName,
      logoUrl: organizationLogoUrl,
    },
  });
  return organization;
}

export async function getOrganizations() {
  await validateSession();
  let organizations = await prisma.organization.findMany({});
  let filteredOrgs = [];
  for (let organization of organizations) {
    let permissions = await getPermissions("organization", organization.id);
    let filteredPermissions = permissions.filter(
      (permission) =>
        permission.includes(":organization") &&
        permission !== "create:organization"
    );
    if (filteredPermissions.length > 0) {
      filteredOrgs.push(organization);
    }
  }
  return filteredOrgs;
}

export async function getOrganization(organizationId) {
  await validateSession();
  let permissions = await getPermissions("organization", organizationId);
  let filteredPermissions = permissions.filter(
    (permission) =>
      permission.includes(":organization") &&
      permission !== "create:organization"
  );
  if (filteredPermissions.length == 0) {
    throw new Error("You do not have permission to view this organization.");
  }
  let organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });
  return organization;
}

export async function getUsers(organizationId) {
  await validateSession();
  let permissions = await getPermissions("organization", organizationId);
  let filteredPermissions = permissions.filter((permission) => {
    return permission.includes(":user") && permission !== "create:user";
  });
  if (filteredPermissions.length == 0) {
    return [];
  }
  let users = await prisma.user.findMany({
    where: {
      organizationId: organizationId,
    },
  });
  return users;
}
