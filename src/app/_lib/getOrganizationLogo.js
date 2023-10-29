"use server";

import { usePrisma } from "./prisma";
import { validateSession } from "./session";

export default async function getOrganizationLogoUrl() {
  const prisma = usePrisma();
  let session = await validateSession();
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      organization: true,
    },
  });
  return user.organization.logoUrl;
}
