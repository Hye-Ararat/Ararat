import nookies from "nookies";
import { post } from "../../../../lib/requestClient";

export async function getInstanceFile(id: string, path: string, authorization: string) {
    return new Promise(async (resolve, reject) => {
        fetch(`${typeof document != 'undefined' ? "" : "http://127.0.0.1:3000"}/api/v1/instances/${id}/files?path=${path}` , {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authorization ? authorization : nookies.get(null).authorization}`
            }
        }).then(async res => {
            let dat = res;
            let data;
            data = (await dat.json()).metadata;

            return resolve(data)
        }).catch(err => {
            return reject(err)
        })      
    })
  }

export async function createInstanceFile(id: string, path: string, data?: string) {
    let token = nookies.get(null).authorization;
    let length = data ? data.length : 0;
    return new Promise(async (resolve, reject) => {
        let config: RequestInit = {
            headers: {
                "Content-Type": "text/plain",
                "Content-Length": length.toString()
            },
            cache: "no-cache",
        }
        if (data) config.body = data;
        let dat = await post(`/api/v1/instances/${id}/files?path=${path}`, config, token);
        resolve(dat)
    })
}