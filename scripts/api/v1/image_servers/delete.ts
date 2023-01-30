export default async function deleteImageServer(id: string) {
    return new Promise(async (resolve, reject) => {
        fetch(`/api/v1/image_servers/${id}` , {
            method: "DELETE",
            cache: "no-cache",
            
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