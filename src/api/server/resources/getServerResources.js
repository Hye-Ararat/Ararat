import axios from 'axios'
import Cookies from 'js-cookie'
async function getServerResources(identifier, callback) {
    return new Promise(async (resolve,reject) => {
        axios.get(`https://ararat-backend.hyehosting.com/servers/${identifier}/resources?token=${Cookies.get('token')}`).then((d) => {
            resolve(d.data)
        }).catch((e) => {
            reject(e)
        })
       
    })
 
}
export default getServerResources