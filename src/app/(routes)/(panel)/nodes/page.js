import { Flex, Title } from "@mantine/core";
import AddNode from "./addNode";
import { validateSession } from "@/app/_lib/session";
import { getRoles } from "@/app/_lib/roles";

export default async function Nodes() {
  const session = await validateSession();
  let roles = await getRoles(session.user.id);
  return (
    <Flex>
      <Title order={1} my="auto">
        Nodes
      </Title>
      {roles.global.includes("node-operator") ? <AddNode /> : ""}
    </Flex>
  );
}
