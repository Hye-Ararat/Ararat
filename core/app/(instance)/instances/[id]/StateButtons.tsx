"use client";
import {Button} from "../../../../components/base";
import lxd from "../../../../lib/lxd";
import nookies from "nookies";

export default function StateButtons({instance, status}){
    let access_token = nookies.get().access_token;
    let client = lxd(access_token);
    return (
        <>
        <Button
        onClick={async () => {
            let operation = await client.instances.instance(instance.name).changeState("start")
        }}
        disabled={status == "Running"} sx={{ml: "auto", mr: 2}} variant='contained' color="success">Start</Button>
        <Button onClick={async () => {
            let operation = await client.instances.instance(instance.name).changeState("stop")
        }} disabled={status != "Running"} sx={{mr: 2}} variant='contained' color="error">Stop</Button>
        <Button onClick={async () => {
            let operation = await client.instances.instance(instance.name).changeState("restart")
        }} disabled={status != "Running"} variant='contained' color="warning">Restart</Button>
        </>
    )
}