import { getBrandIcon } from "@/app/_lib/icons";
import { usePrisma } from "@/app/_lib/prisma";
import { validateSession } from "@/app/_lib/session";
import { Box, Button, Flex, Tabs, Text, Title } from "@mantine/core";
import NodeTabs from "./nodeTabs";
import { getRoles } from "@/app/_lib/roles";
import NodePowerActions from "./nodePowerActions";
import NodePowerStatus from "./nodePowerStatus";

export default async function Layout({ children, params }) {
  let session = await validateSession();
  let prisma = usePrisma();
  let roles = await getRoles(session.user.id, parseInt(params.node));
  if (!roles.length > 0) {
    return <pre>You do not have access to this node</pre>;
  }
  let node = await prisma.node.findUnique({
    where: {
      id: parseInt(params.node),
    },
  });

  return (
    <>
      <Flex>
        {getBrandIcon(node.brand, 60, {
          marginRight: 12,
          marginTop: "auto",
          marginBottom: "auto",
        })}
        <Flex direction="column" my="auto">
          <Title order={1}>{node.name}</Title>
          <NodePowerStatus node={node} />
        </Flex>
        {roles.includes("node-operator") || roles.includes("node-user") ? (
          <Box ml="auto" my="auto">
            <NodePowerActions node={node} />
          </Box>
        ) : (
          ""
        )}
      </Flex>
      <Tabs mt="sm">
        <NodeTabs />
      </Tabs>
      {children}
    </>
  );
}
