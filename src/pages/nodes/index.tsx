import CreateNode from '@/components/nodes/CreateNode'
import prisma from '@/lib/prisma'
import { Button, Flex, Title } from '@mantine/core'
import { Node } from '@prisma/client';


export async function getServerSideProps() {
  const nodes = await prisma.node.findMany({});
  return {
    props: {
      nodes
    }
}
}

export default function Nodes({nodes} : {nodes: Node[]}) {
  return (
    <>
    <Flex>
    <Title order={1}>Nodes</Title>
    <CreateNode />
    </Flex>
    {nodes.map((node) => (
      <Flex key={node.id}>
      <Title order={3}>{node.name}</Title>
      </Flex>
    ))}
    </>
  )
}
