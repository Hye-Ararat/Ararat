import headers, {cookies} from "next/headers";
import lxd from "../../../../lib/lxd";

export default async function Instance(query) {
    let id = query.params.id
    let accessToken = cookies().get("access_token").value;
    let client = lxd(accessToken);
    let instance = await client.instances.instance(id).metadata;
    console.log(instance)
    return (
        <>
        <p>instance</p>
        <p>{instance.name}</p>
        </>
    )
}