import { DataTable, DataTableColumn, DataTableRow } from "@/components/DataTable";
import { getImageServers } from "@/lib/db";
import { validateSession } from "@/lib/oidc";
import { ImageServer } from "@/types/db";
import { ActionIcon, Button, Checkbox, Flex, Group, Modal, Text, TextInput, Title, useMantineTheme } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

export async function getServerSideProps({req, res}: any) {
    const valid = await validateSession(req.cookies.access_token)
    if (!valid) {
        res.setHeader("Set-Cookie", ["access_token=deleted; Max-Age=0"])
        return {
            redirect: {
                permanent: false,
                destination: `/authentication/login`
            },
        }
    };
    const imageServers = await getImageServers();
    console.log(imageServers)
    return {
        props: {
            imageServers
        }
    }
}

export default function ImageServers({imageServers}: {imageServers: ImageServer[]}) {
    const [addingImageServer, setAddingImageServer] = useState(false);
    const [imageServerName, setImageServerName] = useState("");
    const [imageServerUrl, setImageServerUrl] = useState("");
    const [selected, setSelected] = useState([]);
    const theme = useMantineTheme();
    const router = useRouter();
    return (
        <>
        <Flex>
        <Title order={1} my="auto">Image Servers</Title>
        <div style={{ marginLeft: "auto" }}>
          {selected.filter(s => s.checked == true).length > 0 ? <>
            <Group>
              <ActionIcon color="red" variant="light" size={"lg"} onClick={() => {
                selected.forEach(async (s) => {
                  await fetch(`/api/image_servers/${s.id}`, {
                method: "DELETE",  
                })
                router.push(router.asPath)
                    });
              }}>
                <IconTrash size={"1.2rem"} />
              </ActionIcon>
              <Button variant="light" onClick={() => {
                setSelected([])
              }}>Cancel</Button>
            </Group>
          </> :         <Button onClick={() => {
            new Audio("/audio/popup.mp3").play();
            setAddingImageServer(true)
            }} ml="auto" my="auto">Add Image Server</Button>}
         
        </div>
            <Modal overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} opened={addingImageServer} onClose={() => setAddingImageServer(false)} title="Add Image Server" centered>
                <TextInput onChange={(e) => setImageServerName(e.target.value)} value={imageServerName} withAsterisk label="Image Server Name" placeholder="Image Server Name" />
                <TextInput onChange={(e) => setImageServerUrl(e.target.value)} value={imageServerUrl} withAsterisk label="Image Server URL" placeholder="Image URL" />
                <Flex>
                    <Button onClick={async () => {
                        await fetch("/api/image_servers", {
                            method: "POST",
                            body: JSON.stringify({
                                name: imageServerName,
                                url: imageServerUrl
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            cache: "no-cache"
                        });
                        setAddingImageServer(false);
                        router.push(router.asPath);

                    }} ml="auto" variant="light" color="green" mt="sm">Add Image Server</Button>
                </Flex>
            </Modal>
        </Flex>
        <DataTable>
        {imageServers.map((imageServer) => {
            return (
                <DataTableRow>
                    <DataTableColumn>
                        <Group>
                        <Checkbox checked={selected.find(s => s.id == imageServer["_id"])?.checked} onChange={(event) => {
                            if (event.currentTarget.checked) {
                                setSelected([...selected, {id: imageServer["_id"], checked: true}])
                            } else {
                                setSelected(selected.filter(s => s.id != imageServer["_id"]))
                            }
          }} />
           <div>
            <Text fz="md" fw={550}>
              {imageServer.name}
            </Text>
            <Text c="dimmed" fz="xs">
              Image Server Name
            </Text>
          </div>
                        </Group>
                    </DataTableColumn>
      <DataTableColumn>
        <Text>
        <div>
            <Text fz="md" fw={550}>
              {imageServer.url}
            </Text>
            <Text c="dimmed" fz="xs">
              URL
            </Text>
          </div>
        </Text>
      </DataTableColumn>
      <DataTableColumn>
        <Flex>
        <Button ml="auto">Edit</Button>
        </Flex>
      </DataTableColumn>
                </DataTableRow>
            )
        })}
        </DataTable>
        </>
    )
}