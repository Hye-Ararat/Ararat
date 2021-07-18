import axios from 'axios'
import Cookies from 'js-cookie'
async function getServerFiles(identifier, path, callback){
    var server_files = await axios.get(`https://ararat-backend.hyehosting.com/server/${identifier}/files?directory=%2F${path.replace('#', "")}&token=${Cookies.get('token')}`)
    console.log(server_files.data)
    callback(server_files.data.data)
}
export default getServerFiles