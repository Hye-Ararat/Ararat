import axios from 'axios'
import Cookies from 'js-cookie'
async function getServerType(identifier, callback){
    var server_type = (await axios.get(`https://ararat-backend.hyehosting.com/server/${identifier}/type?token=${Cookies.get('token')}`)).data
    callback(server_type)
}
export default getServerType