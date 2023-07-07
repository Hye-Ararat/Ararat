import { LxdInstance } from "@/types/instance";
import { ActionIcon, Anchor, Breadcrumbs, Button, Grid, Group, Menu, SegmentedControl, Text, Center, Modal } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconFile, IconFolder, IconLayoutGrid, IconLayoutList, IconPlus } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { GridFileView } from "@/components/instances/instance/files/GridFileView";
import { ListFileView } from "@/components/instances/instance/files/ListFileView";
import { connectOIDC } from "js-lxd";
import { InstanceContext } from "@/components/AppShell";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { useTheme } from "@emotion/react";

export async function getServerSideProps({ req, res, params }: GetServerSidePropsContext) {
    // TODO: iterate nodes
    console.log(req.cookies)
    let client = connectOIDC("https://192.168.1.133:8443", (req.cookies.access_token as string))
    try {
        let instance = (await client.get(`/instances/${(params as ParsedUrlQuery).instance}?recursion=1`)).data.metadata
        return {
            props: {
                instance
            }
        }
    } catch (error) {
        console.log(error)
        res.setHeader("Set-Cookie", ["access_token=deleted; Max-Age=0"])
        return {
            redirect: {
                permanent: false,
                destination: `/authentication/login`
            },
        };
    }
}
export default function InstanceFiles({ instance }: { instance: LxdInstance }) {
    let [fileView, setFileView] = useState<string>("grid")
    const [creatingFile, setCreatingFile] = useState(false);
    const [instanceData, setInstanceData]= useContext(InstanceContext);
    useEffect(() => {
        setInstanceData(instance);
    }, [])
    useEffect(() => {
        if (creatingFile) {
            let audio = new Audio("/audio/popup.mp3");
            audio.play();
        }
    }, [creatingFile])
    const theme = useTheme()
    return (
        <>
        <Modal centered overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }}  opened={creatingFile} onClose={() => setCreatingFile(false)} title="Create File">
            
        </Modal>
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
                    <Menu.Item onClick={() => setCreatingFile(true)} icon={<IconFile />}>
                        File
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

        </Group>
        {fileView == "grid" ? <GridFileView /> : (fileView == "list" ? <ListFileView /> : "")}
        </>
       
    )
}