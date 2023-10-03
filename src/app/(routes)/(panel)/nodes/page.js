import { Button, Flex, Title } from "@mantine/core";

export default async function Nodes() {
  return (
    <Flex>
      <Title order={1} my="auto">
        Nodes
      </Title>
      <Button ml="auto" my="auto">
        Add Node
      </Button>
    </Flex>
  );
}
