import CreateInstance from "@/components/instances/CreateInstance";
import { Flex, Title } from "@mantine/core";

export default function Instances() {
    return (
        <Flex>
        <Title order={1}>Instances</Title>
        <CreateInstance />
        </Flex>
    )
}