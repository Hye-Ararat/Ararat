import axios from 'axios'
import Cookies from 'js-cookie'
async function getFileContents(identifier, path, callback){
    var server_files = await axios.get(`https://ararat-backend.hyehosting.com/server/${identifier}/files/contents?file=%2F${path.replace('#', "")}&token=${Cookies.get('token')}`)
    console.log(typeof server_files.data)
    if (typeof server_files.data == 'object') {
        callback(JSON.stringify(server_files.data))
    } else {
        callback(server_files.data)
    }
    
}
export default getFileContents