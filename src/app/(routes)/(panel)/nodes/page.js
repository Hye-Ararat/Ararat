import { Flex, Title } from "@mantine/core";
import AddNode from "./addNode";
import { validateSession } from "@/app/_lib/session";

export default async function Nodes() {
  const session = await validateSession();
  return (
    <Flex>
      <Title order={1} my="auto">
        Nodes
      </Title>
      <AddNode />
    </Flex>
  );
}
