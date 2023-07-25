import { Button, Flex, Title } from "@mantine/core";

export default function ImageServers() {
    return (
        <Flex>
        <Title order={1} my="auto">Image Servers</Title>
        <Button ml="auto" my="auto">Add Image Server</Button>
        </Flex>
    )
}