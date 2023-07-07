import { Anchor, Button, Center, Grid, Group, Menu, Paper, Popover, Stack, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconDownload, IconFile, IconFolder, IconPencil, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export function GridFileView({files}) {
    return (
        <Grid gutter={20} pt={20} columns={18}>
            {files.map((file) => {
                return(
                     <GridFileViewItem file={file} folder={true} />
                )
            })}
        </Grid>
    )
}
function GridFileViewItem({ file, folder }: { folder?: boolean }) {
    const [opened, setOpened] = useState(false);
    const ref = useClickOutside(() => setOpened(false));
    const router = useRouter();
    return (
        <Menu opened={opened} withArrow onClick={() => {
            const path = router.query.path as string;
            router.push(`/instances/${router.query.instance}/files?path=${path}/${file}`)
        }}>
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
                                            {file}
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