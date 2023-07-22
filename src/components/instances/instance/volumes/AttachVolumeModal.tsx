import { capitalizeFirstLetter } from "@/lib/util";
import { LxdInstance, NodeLxdInstance } from "@/types/instance";

import { Button, Flex, Select, TextInput } from "@mantine/core";
import { getCookie } from "cookies-next";
import { connectOIDC } from "js-lxd";
import { useEffect, useState } from "react";
import axios from "axios"
import { useRouter } from "next/router";
export function AttachVolumeModal({ instance, url, setAttachOpen }: { instance: NodeLxdInstance, url: string }) {
    var [pathError, setPathError] = useState<string>()
    var [volumes, setVolumes] = useState<any[]>([])
    const [volume, setVolume] = useState<string>()
    const [mount, setMount] = useState<string>()
    const [name,setName] = useState<string>()
    var access_token = (getCookie("access_token") as string)
    const client = connectOIDC(instance.node.url, access_token)
    useEffect(() => {
        axios.get(`/api/volumes/${instance.node.name}`).then(({ data }) => {
            setVolumes(data)
        })
    }, [])
    const router = useRouter();
    return (
        <>
            <TextInput my={10} defaultValue={""} label="Device Name" onChange={(e) => {
                setName(e.currentTarget.value)
            }}></TextInput>
            <Select
                label="Storage volume"
                placeholder="Pick one"
                my={10}
                dropdownPosition="flip"
                data={volumes.filter((s) => s.type == "custom").map((vol) => {
                    return { label: capitalizeFirstLetter(vol.name), value: vol.name }
                })}
                onSelect={(s) => {
                    setVolume(s.currentTarget.value)
                }}
            />
            <TextInput my={10} defaultValue={""} label="Mount Path" error={pathError} onChange={(e) => {
                if (e.currentTarget.value == "/") {
                    setPathError("Path cannot be /")
                } else {
                    setMount(e.currentTarget.value)
                    setPathError(undefined)
                }
            }}></TextInput>
            <Flex>
                <Button variant="light" ml={"auto"} color="green" onClick={() => {
                    if (volume && mount && volumes && name) {
                        var devConf = {
                            "type": "disk",
                            "pool": volumes?.find((po) => po.name == volume?.toLowerCase()).pool,
                            "source": volume.toLocaleLowerCase(),
                            "path": mount
                        }
                        client.get(`/instances/${instance.name}`).then(({ data }) => {
                            var instanceData: LxdInstance = data.metadata
                            //@ts-expect-error
                            instanceData.devices[name] = devConf;
                            client.put(`/instances/${instance.name}`, instanceData).then((d) => {
                                console.log(d)
                                router.push(window.location.pathname)
                                setAttachOpen(false);
                            })
                        })
                    }
                }}>Mount</Button>
            </Flex>

        </>
    )
}