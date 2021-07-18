import axios from 'axios'
import Cookies from 'js-cookie'
async function getFileDownloadLink(identifier, path, callback){
    var server_files = await axios.get(`https://ararat-backend.hyehosting.com/server/${identifier}/files/download?file=%2F${path.replace('#', "")}&token=${Cookies.get('token')}`)
    console.log(typeof server_files.data)
    callback(server_files.data.attributes.url)
    
}
export default getFileDownloadLink