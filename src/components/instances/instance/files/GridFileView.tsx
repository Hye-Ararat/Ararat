import { Anchor, Button, Center, Grid, Group, Menu, Paper, Popover, Stack, Text, UnstyledButton } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconDownload, IconFile, IconFolder, IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

export function GridFileView() {
    return (
        <Grid gutter={20} pt={20} columns={18}>
            <GridFileViewItem />
        </Grid>
    )
}
function GridFileViewItem({ folder }: { folder?: boolean }) {
    const [opened, setOpened] = useState(false);
    const ref = useClickOutside(() => setOpened(false));
    return (

        <Menu opened={opened} withArrow>
            <Menu.Target>
                <Grid.Col span={2}>
                    <Anchor underline={false} onContextMenu={(e) => {
                        e.preventDefault()
                        setOpened(!opened)
                    }} ref={ref}>
                        <Paper radius={20}>
                            <Center py={20}>
                                <Stack>
                                    <Center>
                                        <IconFolder size={75} />
                                    </Center>
                                    <Center>
                                        <Text>
                                            TestFolder
                                        </Text>
                                    </Center>
                                </Stack>
                            </Center>
                        </Paper>
                    </Anchor>
                </Grid.Col>
            </Menu.Target>
            <Menu.Dropdown>
                {folder ? "" : <Menu.Item icon={<IconDownload />} color="blue">
                    Download
                </Menu.Item>}
                <Menu.Item icon={<IconPencil />} color="teal">
                    Rename
                </Menu.Item>
                <Menu.Item icon={<IconTrash />} color="red">
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}