const {Issuer} = require('openid-client');
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req, res) {
    let body = await req.text();
    let scope = new URLSearchParams(body).get("scope");
    if (!scope) scope = "openid";
    let client_id = new URLSearchParams(body).get("client_id");
    if (!client_id) client_id = "";
    let formData = new FormData();
    formData.append("scope", scope);
    formData.append("client_id", client_id);
    let data = await axios( {
        "url": "http://127.0.0.1:8080/realms/Ararat/protocol/openid-connect/auth/device?scope=openid&client_id=lxd",
        "data": body,
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",

        }
    })
    console.log(data.data)
    data = JSON.parse(JSON.stringify(data.data).replaceAll("http://127.0.0.1:8080", "https://" + req.headers.get("host")))
    return NextResponse.json(data);
       
}