"use client";

import { Button, Center, Paper, Text, Flex, Divider } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { IconBrandGithub, IconQuestionMark, IconShoppingBag } from "@tabler/icons-react";
import { FaWhmcs } from "react-icons/fa"
import { signIn } from "next-auth/react";
import { useState } from "react";
function getProviderBranding(id) {
    switch (id) {
        case "github":
            return {
                icon: <IconBrandGithub style={{ width: '1rem', height: '1rem' }} />,
                color: "var(--mantine-color-dark-6)"
            };
        case "whmcs":
            return {
                icon: <FaWhmcs style={{ width: '1rem', height: '1rem' }} />,
                color: "var(--mantine-color-green-filled)"
            };
        default:
            return {
                icon: <IconQuestionMark style={{ width: '1rem', height: '1rem' }} />,
                color: "white"
            };
    }
}
function getLoginError(err) {
    switch (err) {
        case "OAuthSignin":
            return "Cannot construct auth URL";
        case "OAuthCallback":
            return "Provider response error";
        case "OAuthCreateAccount":
            return "Could not create user";
        case "EmailCreateAccount":
            return "Could not create user";
        case "Callback":
            return "Callback URL Error";
        case "OAuthAccountNotLinked":
            return "Account not linked";
        case "EmailSignin":
            return "Verification email failed";
        case "CredentialsSignin":
            return "Invalid credentials";
        case "SessionRequired":
            return "Session required";
        default:
            return err;
    }
}
export default function LoginForm({ providers }) {
    console.log(providers)
    const query = useSearchParams()
    return (
        <Center style={{ width: "100%", height: "100%" }}>
            <Paper radius={10} p={15} bg={"var(--mantine-color-dark-8)"} my={"auto"} >
                <Flex>
                    <Image src="/logo.png" width={60} height={60} style={{ marginRight: "auto", marginLeft: "auto" }} />
                </Flex>
                <Text ta="center" size="lg" fz={20} fw={600} weight={500}>
                    Welcome to Hye Ararat!
                </Text>
                <Text color="red" size="sm" align="center">
                    {query.has("error") ? "An error has occured: " + getLoginError(query.get("error")) : ""}
                </Text>
                <Divider mb="xl" label="Please login to continue" labelPosition="center" my="lg" />

                {Object.values(providers ?? []).map((provider) => {
                    const branding = getProviderBranding(provider.id)
                    const [loading, setLoading] = useState(false);
                    return (
                        <Button loading={loading} mb="xs" onClick={() => {
                            setLoading(true)
                            signIn(provider.id)
                        }} leftSection={branding.icon} bg={branding.color} w={"100%"}>
                            Sign in with {provider.name}
                        </Button>
                    )
                })}
            </Paper>
        </Center>

    )
}