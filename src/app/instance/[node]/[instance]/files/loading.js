import { Flex, Loader } from "@mantine/core-app";

export default async function Loading() {
    return (
        <Flex mt="xs">
            <Loader mx="auto" />
        </Flex>
    )
}