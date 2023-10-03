import { Button, Flex, Title } from "@mantine/core";

export default async function Instances() {
  return (
    <Flex>
      <Title order={1} my="auto">
        Instances
      </Title>
      <Button ml="auto" my="auto">
        Create Instance
      </Button>
    </Flex>
  );
}
