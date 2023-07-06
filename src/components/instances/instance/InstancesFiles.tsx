import { LxdInstance } from "@/types/instance";
import { ActionIcon, Anchor, Breadcrumbs, Button, Grid, Group, Menu, SegmentedControl, Text, Center } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconFile, IconFolder, IconLayoutGrid, IconLayoutList, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { GridFileView } from "./files/GridFileView"
import { ListFileView } from "./files/ListFileView"
export function InstanceFiles({ instance }: { instance: LxdInstance }) {
    let [fileView, setFileView] = useState<string>("grid")
    return (
        <>
         <Group spacing={10} mt={"sm"}>
            <ActionIcon color="blue" variant="light" size={"md"}>
                <IconArrowLeft />
            </ActionIcon>
            <ActionIcon color="blue" variant="light" size={"md"}>
                <IconArrowRight />
            </ActionIcon>
            <Breadcrumbs ml={10}>
                <Anchor>usr</Anchor>
                <Anchor>share</Anchor>
                <Anchor>local</Anchor>
            </Breadcrumbs>
            <SegmentedControl sx={{ marginLeft: "auto" }} color="blue" data={[
                {label: (<Center><IconLayoutGrid /></Center>), value: "grid"},
                {label: (<Center><IconLayoutList /></Center>), value: "list"}
            ]} onChange={setFileView} value={fileView}/>
            <Menu>
                <Menu.Target>
                    <Button leftIcon={<IconPlus />} color="green" variant="light">
                        Create
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<IconFolder />}>
                        Directory
                    </Menu.Item>
                    <Menu.Item icon={<IconFile />}>
                        File
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

        </Group>
        {fileView == "grid" ? <GridFileView /> : (fileView == "list" ? <ListFileView /> : "")}
        </>
       
    )
}