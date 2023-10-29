"use client";

import { SimpleGrid, TextInput, Select, Title, Divider, Button, Flex, Accordion, Checkbox } from "@mantine/core";
import { useState, useEffect } from "react";
import allPermissions from "@/app/_lib/allPermissions";
import prisma from "@/app/_lib/prisma";

export default function User({ user, permissions }) {
    const [userEmail, setUserEmail] = useState(user.email)
    const [userName, setUserName] = useState(user.name)
    const [scope, setScope] = useState("Global")
    const [activePermissions, setActivePermissions] = useState({});
    useEffect(() => {
        if (scope == "Global") {
            let newPermissions = allPermissions;
             Object.keys(allPermissions).map((group) => {
                Object.keys(allPermissions[group]).map((permission) => {
                    console.log(permissions, permission)
                    if (!permissions.includes(permission)) {
                        delete newPermissions[group][permission]
                    }

                })
            }) 
            setActivePermissions(newPermissions)
        }
        if (scope == "Organization") {
            let newPerms = {};
            Object.keys(allPermissions).map((group) => {
                Object.keys(allPermissions[group]).map((permission) => {    
                    if (allPermissions[group][permission].scopes.includes("organization")) {
                          if (permissions.includes(permission)) {
                            if (!newPerms[group]) {
                                newPerms[group] = {}
                            }
                              newPerms[group][permission] = allPermissions[group][permission]
                         }
                    }
                 })
            })
            console.log(newPerms)
            setActivePermissions(newPerms)
        }
    }, [scope])
    return (
        <>
            <Title order={4}>User Information</Title>
            <SimpleGrid cols={3}>
                <TextInput placeholder="Joseph Maldjian" label="Name" value={userName} disabled={!permissions.includes("update:user")} />
                <TextInput placeholder="joseph@hyeararat.com" value={userEmail} label="Email" disabled={!permissions.includes("update:user")} />
                <Select data={[{ label: "WHMCS", "value": "whmcs" }, { label: "Email/Password", value: "basic" }]} placeholder="Authentication Provider" label="Authentication Provider" value={user.authProvider} disabled />

            </SimpleGrid>
            <Flex mt="md">
                <Button ml="auto" size="xs" variant="light">Save Changes</Button>
            </Flex>
            <Divider my="sm" />
            <Flex>
                <Title my="auto" order={4}>Permissions</Title>
                <Select size="xs" ml="auto" my="auto" data={["Global","Organization"]} value={scope} onChange={(e) => e ? setScope(e) : setScope(scope)} />
            </Flex>
            <Accordion mt="xs" variant="contained">
                {Object.keys(activePermissions).map((group) => {
                    return (
                        <Accordion.Item key={group} label={group} value={group}>
                            <Accordion.Control>
                                {group.charAt(0).toUpperCase() + group.slice(1)}
                            </Accordion.Control>
                            <Accordion.Panel>
                                <SimpleGrid cols={3}>
                                    {Object.keys(activePermissions[group]).map((permission) => {
                                        return (
                                            <Checkbox value={permission} label={activePermissions[group][permission].title} description={activePermissions[group][permission].description} />
                                        )
                                    })}
                                    </SimpleGrid>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )
                })}
            </Accordion>

        </>
    )
}