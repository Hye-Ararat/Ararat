import { getPermissions } from "@/app/_lib/permissions";
import { Flex, Title } from "@mantine/core";
import { useMemo } from "react";
import Org from "./organization";
import prisma from "@/app/_lib/prisma.js";
import CreateOrganization from "./createOrganization.js";
import { getOrganizations } from "@/app/_lib/organizations";
export default async function Organizations() {
  let permissions = await getPermissions();
  let organizations = await getOrganizations();

  return (
    <>
      <Flex mb="sm">
        <Title order={1} my="auto">
          Organizations
        </Title>
        {permissions.includes("create:organization") ? (
          <CreateOrganization />
        ) : null}
      </Flex>
      <div style={{ width: "100%" }}>
        {" "}
        {organizations.map((organization) => {
          return <Org organization={organization} />;
        })}
      </div>
    </>
  );
}
