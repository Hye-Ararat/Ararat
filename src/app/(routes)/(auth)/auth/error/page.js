"use client";
import { Center, Paper, Text, Title, Button, Flex } from "@mantine/core";
import { redirect, useSearchParams } from "next/navigation";

export default function Error() {
    const query = useSearchParams()
    if (!query.has("error")) return redirect("/auth/login");
    return (
        <Center style={{ width: "100%", height: "100%" }}>
        <Paper radius={10} p={20} bg={"var(--mantine-color-dark-8)"} my={"auto"}>
            <Title align="center" order={1} color="red">Oh no! Anyways...</Title>
             <Text color="red">
                An error occured during authentication: {" "}
                {query.get("error")}
             </Text>
             <Flex>
             <Button component="a" href="/auth/login" mx="auto" mt="sm">Try Again</Button>
             </Flex>
        </Paper>
    </Center>
    );
}