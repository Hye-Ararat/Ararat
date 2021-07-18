import axios from 'axios'
import Cookies from 'js-cookie'
async function getServer(identifier, callback){
    var server_data = await axios.get(`https://ararat-backend.hyehosting.com/server/${identifier}?token=${Cookies.get('token')}`)
    callback(server_data.data)
}
export default getServer