import CreateNode from '@/components/nodes/CreateNode'
import mongo from '@/lib/mongo'
import { Button, Flex, Title, Text, Group, Badge, ActionIcon, Table, Checkbox } from '@mantine/core';
import { connectOIDC } from 'incus'
import { DataTable, DataTableColumn, DataTableRow } from '@/components/DataTable'
import { LxdResources } from '@/types/resources'
import { IconServer2, IconTrash, IconX } from '@tabler/icons-react';
import prettyBytes from 'pretty-bytes'
import { MainContext } from '@/components/AppShell'
import { createContext, useContext, useState } from 'react'
import { getVendorLogo } from '@/lib/logo';
import Link from 'next/link';

const NodeContext = createContext({ setActiveNode: (node: string) => { }, activeNode: "", selectedNodes: ([] as { id: string, checked: boolean }[]), setSelectedNodes: (nodes: { id: string, checked: boolean }[]) => { } })

export async function getServerSideProps({ req, res }: any) {
  var nodesCollection = await mongo.db().collection("Node")
  let nodes = await ((await nodesCollection.find({})).toArray())
  nodes = await Promise.all(nodes.map(async (node) => {
    var client = connectOIDC(node.url, req.cookies.access_token)
    try {
      var nodeData = (await client.get("/resources")).data.metadata
      var nodeInstances = (await client.get("/instances")).data.metadata
    } catch (error) {
      console.log(error)
      return { name: node.name, status: "offline" }
    }
    return { ...nodeData, name: node.name, status: "online", instances: nodeInstances.length }
  }))
  console.log(nodes)
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
  const { setActiveNode, activeNode, setSelectedNodes, selectedNodes } = useContext(NodeContext)
  const { setAside, setAsideOpen, asideOpen } = useContext(MainContext)

  function setSelect(checked: boolean) {
    if (checked == false) {
      var i = selectedNodes.findIndex(s => s.id == node.name)
      var tmp = [...selectedNodes]
      tmp[i].checked = false
      setSelectedNodes(tmp)
    } else {
      var i = selectedNodes.findIndex(s => s.id == node.name)
      var tmp = [...selectedNodes]
      tmp[i].checked = true
      setSelectedNodes(tmp)
    }
  }
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
          <Checkbox checked={selectedNodes.find(s => s.id == node.name)?.checked} onChange={(event) => {
            setSelect(event.currentTarget.checked)
          }} />
          {getVendorLogo(node.system.vendor ?? "", 40)}

          <div>
            <Text fz="md" fw={550}>
              {node.name}
            </Text>
            <Text c="dimmed" fz="xs">
              {node.system.product}
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
              Memory
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
          <Link href={`/nodes/${node.name}`}>
            <Button sx={{ mr: 40 }}>Manage</Button>
          </Link>
        </Group>
      </DataTableColumn>
    </DataTableRow>
  )
}

export default function Nodes({ nodes }: { nodes: (LxdResources & { name: string, status: string, instances: number })[] }) {
  var [activeNode, setActiveNode] = useState<string>("")
  var initialCheckedNodes = ([] as { id: string, checked: boolean }[])
  nodes.forEach(node => {
    initialCheckedNodes.push({ id: node.name, checked: false })
  })
  var [selectedNodes, setSelectedNodes] = useState<{ id: string, checked: boolean }[]>(initialCheckedNodes)

  return (
    <>
      <Flex>
        <Title order={1}>Nodes</Title>
        <div style={{ marginLeft: "auto" }}>
          {selectedNodes.filter(s => s.checked == true).length > 0 ? <>
            <Group>
              <ActionIcon color="red" variant="light" size={"lg"}>
                <IconTrash size={"1.2rem"} />
              </ActionIcon>
              <Button variant="light" onClick={() => {
                setSelectedNodes(initialCheckedNodes)
              }}>Cancel</Button>
            </Group>
          </> : ""}
          {selectedNodes.filter(s => s.checked == true).length == 0 ? <>
            <CreateNode />
          </> : ""}
        </div>
      </Flex>
      <DataTable>
        <NodeContext.Provider value={{ activeNode, setActiveNode, selectedNodes, setSelectedNodes }}>
          {nodes.map((node) => (
            <NodeTableRow node={node} />
          ))}
        </NodeContext.Provider>

      </DataTable>
    </>
  )
}
