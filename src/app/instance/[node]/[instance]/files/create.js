"use client";

import { Button, Menu, Title, Modal, TextInput, Flex } from "@mantine/core-app";
import { IconPlus, IconFile, IconFolder, IconUpload } from "@tabler/icons-react";
import { useState } from "react";

export default function Create() {
    const [creatingFile, setCreatingFile] = useState(false);
    const [name, setName] = useState(null);
    return (
        <>
            <Modal centered opened={creatingFile} onClose={() => setCreatingFile(false)} title={<Title order={3}>New File</Title>}>
                <TextInput withAsterisk placeholder="index.js" label="File Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Flex mt="md">
                    <Button variant="light" color="red" mr="sm" ml="auto" onClick={() => setCreatingFile(false)}>Cancel</Button>
                    <Button variant="light" color="blue">Create</Button>
                </Flex>
            </Modal>
            <Menu ml="auto">
                <Menu.Target>
                    <Button variant="light" color="green" leftSection={<IconPlus />}>Create</Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item onClick={() => setCreatingFile(true)} leftSection={<IconFile />}>File</Menu.Item>
                    <Menu.Item leftSection={<IconFolder />}>Directory</Menu.Item>
                    <Menu.Item leftSection={<IconUpload />}>Upload</Menu.Item>

                </Menu.Dropdown>
            </Menu>
        </>
    )
}