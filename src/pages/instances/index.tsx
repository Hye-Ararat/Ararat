import CreateInstance from "@/components/instances/CreateInstance";
import { Flex, Title } from "@mantine/core";
import { connectOIDC } from "js-lxd"
export async function getServerSideProps({ req, res }: any) {
    let client = await connectOIDC("https://10.17.167.6:8443", req.cookies.access_token)
    let instances = (await client.get("/instances?recursion=2")).data.metadata
    console.log(instances)
    return {
        props: {
            instances
        }
    }
}

export default function Instances({ instances }: { instances: any }) {
    return (
        <>
            <Flex>
                <Title order={1}>Instances</Title>
                <CreateInstance />
            </Flex>
            {instances.map((instance: any) => {
                return (<div>{instance.name}</div>)
            })}
        </>


    )
}