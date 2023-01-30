export default async function CreateImageServer(url: String, name: string) {
    return new Promise(async (resolve, reject) => {
        fetch("/api/v1/image_servers" , {
            method: "POST",
            
            body: JSON.stringify({
                url,
                name
            }),
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
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