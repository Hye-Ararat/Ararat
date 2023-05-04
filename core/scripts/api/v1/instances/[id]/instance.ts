import nookies from "nookies"

export default async function getInstance(id: string) {
    return new Promise(async (resolve, reject) => {
        fetch(`/api/v1/instances/${id}` , {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${nookies.get(null).authorization}`
            }
        }).then(async res => {
            let dat = res;
            let body = await res.json();
            if (dat.status != 200) return reject(body.metadata);
            return resolve(body.metadata)
        }).catch(err => {
            return reject(err)
        })      
    })
  }