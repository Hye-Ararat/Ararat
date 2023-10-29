import { Flex, Title } from "@mantine/core";
import CreateServer from "./createServer";

export default async function Servers() {
  return (
    <>
      <Flex>
        <Title order={1} my="auto">
          Servers
        </Title>
        <CreateServer />
      </Flex>
    </>
  );
}
