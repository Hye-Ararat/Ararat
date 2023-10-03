import { Flex, Loader, Title } from "@mantine/core";

export default function Loading() {
  return (
    <>
      <Flex>
        <Title order={1} my="auto">
          Instances
        </Title>
      </Flex>
      <Flex>
        <Loader mx="auto" />
      </Flex>
    </>
  );
}
