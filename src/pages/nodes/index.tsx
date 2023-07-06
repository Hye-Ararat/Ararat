import CreateNode from '@/components/nodes/CreateNode'
import mongo from '@/lib/mongo'
import { Button, Flex, Title, Text, Group, Badge, ThemeIcon, ActionIcon, Table } from '@mantine/core'
import { Node } from "@/types/db"
import { sanitizeMany } from '@/lib/db'
import { connectOIDC } from 'js-lxd'
import { DataTable, DataTableColumn, DataTableRow } from '@/components/DataTable'
import { LxdResources } from '@/types/resources'
import { IconServer, IconServer2, IconX } from '@tabler/icons-react'
import prettyBytes from 'pretty-bytes'
import { MainContext } from '@/components/AppShell'
import { createContext, useContext, useState } from 'react'

const NodeContext = createContext({ setActiveNode: (instance: string) => { }, activeNode: "" })

export async function getServerSideProps({ req, res }: any) {
  var nodesCollection = await mongo.db().collection("Node")
  let nodes = await ((await nodesCollection.find({})).toArray())
  nodes = await Promise.all(nodes.map(async (node) => {
    var client = connectOIDC(node.url, req.cookies.access_token)
    try {
      var nodeData = (await client.get("/resources")).data.metadata
      var nodeInstances = (await client.get("/instances")).data.metadata
    } catch (error) {
      return { name: node.name, status: "offline" }
    }
    return { ...nodeData, name: node.name, status: "online", instances: nodeInstances.length }
  }))
  return {
    props: {
      nodes: nodes
    }
  }
}

function NodeAside({ node, closeAside }: { node: LxdResources & { name: string, status: string, instances: number }, closeAside: () => void }) {
  return (
    <>
      <Text pb={"md"}>
        <Group>
          <Text fw={700} fz="lg">
            Node Details
          </Text>
          <Flex align={"flex-end"} direction={"row"} ml={"auto"}>
            <ActionIcon onClick={closeAside}>
              <IconX />
            </ActionIcon>
          </Flex>
        </Group>
      </Text>
      <Table>
        <tbody>
          <tr>
            <td>
              <Text fw={650}>
                Name
              </Text>
            </td>
            <td>
              {node.name ?? "Unknown"}
            </td>
          </tr>
          <tr>
            <td>
              <Text fw={650}>
                Status
              </Text>
            </td>
            <td>
              <Badge color={node.status == "online" ? "green" : "red"}>
                {node.status ?? "Unknown"}
              </Badge>
            </td>
          </tr>
          <tr>
            <td>
              <Text fw={650}>
                Instances
              </Text>
            </td>
            <td>
              {node.instances ?? "Unknown"}
            </td>
          </tr>
          <tr>
            <td>
              <Text fw={650}>
                Architecture
              </Text>
            </td>
            <td>
              {node.cpu.architecture ?? "Unknown"}
            </td>
          </tr>
          <tr>
            <td>
              <Text fw={650}>
                CPU
              </Text>
            </td>
            <td>
              {node.cpu.sockets ? node.cpu.sockets[0].name : "Unknown"}
            </td>
          </tr>
          <tr>
            <td>
              <Text fw={650}>
                Memory
              </Text>
            </td>
            <td>
              {prettyBytes(node.memory ? node.memory.total : 0)}
            </td>
          </tr>
          <tr>
            <td>
              <Text fw={650}>
                Vendor
              </Text>
            </td>
            <td>
              {node.system.vendor ?? "Unknown"}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

function NodeTableRow({ node }: { node: LxdResources & { name: string, status: string, instances: number } }) {
  const { setActiveNode, activeNode } = useContext(NodeContext)
  const { setAside, setAsideOpen, asideOpen } = useContext(MainContext)

  function closeAside() {
    setAsideOpen(false);
    setAside("")
    setActiveNode("")
  }

  return (
    <DataTableRow active={activeNode == node.name} onClick={() => {
      setAsideOpen(true)
      setActiveNode(node.name)
      setAside(<NodeAside node={node} closeAside={closeAside} />)
    }}>
      <DataTableColumn>
        <Group>
          <IconServer2 size={40} />

          <div>
            <Text fz="md" fw={550}>
              {node.name}
            </Text>
            <Text c="dimmed" fz="xs">
              {node.cpu ? node.cpu.architecture : ""}
            </Text>
          </div>

        </Group>
      </DataTableColumn>
      <DataTableColumn>
        <Text>
          <Badge color={node.status == "online" ? "green" : "red"}>
            {node.status}
          </Badge>
        </Text>
      </DataTableColumn>
      <DataTableColumn>
        <Text>
          <div>
            <Text fz="md" fw={550}>
              {node.cpu ? node.cpu.total : 0}
            </Text>
            <Text c="dimmed" fz="xs">
              Cores
            </Text>
          </div>
        </Text>
      </DataTableColumn>
      <DataTableColumn>
        <Text>
          <div>
            <Text fz="md" fw={550}>
              {prettyBytes(node.memory ? node.memory.total : 0)}
            </Text>
            <Text c="dimmed" fz="xs">
              Memory Total
            </Text>
          </div>
        </Text>
      </DataTableColumn>
      <DataTableColumn>
        <Text>
          <div>
            <Text fz="md" fw={550}>
              {node.instances ?? 0}
            </Text>
            <Text c="dimmed" fz="xs">
              Instances
            </Text>
          </div>
        </Text>
      </DataTableColumn>
      <DataTableColumn>
        <Text>
          <div>
            <Text fz="md" fw={550}>
              {prettyBytes(node.storage ? (node.storage.disks?.reduce((prev, cur) => {
                return prev + cur.size;
              }, 0) as number) : 0)}
            </Text>
            <Text c="dimmed" fz="xs">
              Total Disk
            </Text>
          </div>
        </Text>
      </DataTableColumn>
      <DataTableColumn>
        <Group spacing={2} position="right">
          <Button sx={{ mr: 40 }}>Edit</Button>
        </Group>
      </DataTableColumn>
    </DataTableRow>
  )
}

export default function Nodes({ nodes }: { nodes: (LxdResources & { name: string, status: string, instances: number })[] }) {

  var [activeNode, setActiveNode] = useState<string>("")
  console.log(nodes)
  return (
    <>
      <Flex>
        <Title order={1}>Nodes</Title>
        <CreateNode />
      </Flex>
      <DataTable>
        <NodeContext.Provider value={{ activeNode, setActiveNode }}>
          {nodes.map((node) => (
            <NodeTableRow node={node} />
          ))}
        </NodeContext.Provider>

      </DataTable>
    </>
  )
}
