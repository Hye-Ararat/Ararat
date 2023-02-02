import nookies from "nookies";

export default async function getInstanceFile(id: string, path: string, authorization: string) {
    return new Promise(async (resolve, reject) => {
        fetch(`${typeof document != 'undefined' ? "" : "http://localhost:3000"}/api/v1/instances/${id}/files?path=${path}` , {
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