"use server";

import { getPermissions } from "./permissions";
import  prisma from "./prisma";
import { validateSession } from "./session";


export async function createUser(name, email, organizationId) {
  let session = await validateSession();
  let permissions = await getPermissions();
  if (!permissions.includes("create:user")) {
    throw new Error("You do not have permission to create a user.");
  }
  let user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      organization: {
        connect: {
          id: organizationId,
        },
      },
    },
  });
  return user;
}

export async function getUser(userId) {
  let session = await validateSession();
  let permissions = await getPermissions("user", userId);
  let filteredPermissions = permissions.filter((permission) => {
    return permission.includes(":user") && permission != "create:user";
  });
  if (filteredPermissions.length == 0) {
    throw new Error("You do not have permission to view this user.");
  }
  let user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
}

export async function getUsers() {
  let session = await validateSession();
  let users = await prisma.user.findMany({});
  let filteredUsers = [];
  for (let user of users) {
    let permissions = await getPermissions("user", user.id);
    console.log(permissions);
    let filteredPermissions = permissions.filter((permission) => {
      return permission.includes(":user") && permission != "create:user";
    });
    if (filteredPermissions.length > 0) {
      filteredUsers.push(user);
    }
  }
  return filteredUsers;
}
