import axios from 'axios'
import Cookies from 'js-cookie'
async function updateFile(identifier, path, data, callback){
    var response = await axios.post(`https://ararat-backend.hyehosting.com/server/${identifier}/files/write?file=%2F${path.replace('#', "")}&token=${Cookies.get('token')}`, data)
    callback(response.data)
    
}
export default updateFile