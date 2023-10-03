import { Flex, Title } from "@mantine/core";
import AddNode from "./addNode";

export default async function Nodes() {
  return (
    <Flex>
      <Title order={1} my="auto">
        Nodes
      </Title>
      <AddNode />
    </Flex>
  );
}
