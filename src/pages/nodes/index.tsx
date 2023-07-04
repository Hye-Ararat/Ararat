import CreateNode from '@/components/nodes/CreateNode'
import { Flex, Title } from '@mantine/core';


export default function Nodes({testProp} : {testProp: string}) {
  return (
    <>
    <Flex>
    <Title order={1}>Nodes</Title>
    <CreateNode />
    </Flex>
    </>
  )
}
