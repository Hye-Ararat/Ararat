import { Flex, Title } from "@mantine/core";
import AddNode from "./addNode";
import { validateSession } from "@/app/_lib/session";
import { getRoles } from "@/app/_lib/roles";
import { usePrisma } from "@/app/_lib/prisma";
import { resolve } from "path";
import { flag } from "country-emoji";
import { DataTable, DataTableRow } from "@/app/_components/datatable";
import Node from "./node";

export default async function Nodes() {
  const session = await validateSession();
  let roles = await getRoles(session.user.id);
  const prisma = usePrisma();
  let locations = [];
  if (roles.global.includes("node-operator")) {
    locations = await prisma.location.findMany({
      include: {
        locationGroups: true,
      },
    });
  }
  let nodes = [];
  if (JSON.stringify(roles).includes("node")) {
    let nodeQuery = await prisma.node.findMany({
      include: {
        locationGroup: {
          include: {
            location: true,
          },
        },
      },
    });
    let waitNodes = new Promise((resolve, reject) => {
      let count = 0;
      if (nodeQuery.length == 0) {
        resolve();
      }
      nodeQuery.forEach(async (node) => {
        let nodeRoles = await getRoles(session.user.id, node.id);
        if (nodeRoles.length > 0) {
          nodes.push(node);
        }
        count++;
        if (count == nodeQuery.length) {
          resolve();
        }
      });
    });
    await waitNodes;
  }
  return (
    <>
      <Flex mb="sm">
        <Title order={1} my="auto">
          Nodes
        </Title>
        {roles.global.includes("node-operator") ? (
          <AddNode locations={locations} />
        ) : (
          ""
        )}
      </Flex>
      <DataTable>
        {nodes.map((node) => {
          return <Node node={node} />;
        })}
      </DataTable>
    </>
  );
}
