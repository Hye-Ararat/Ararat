import axios from 'axios'
import Cookies from 'js-cookie'
import getServerResources from './resources/getServerResources'
async function getServers(callback){
    var server_list = (await axios.get(`https://ararat-backend.hyehosting.com/servers?token=${Cookies.get('token')}`))
    console.log(server_list.data)
    callback(server_list.data)

}
export default getServers