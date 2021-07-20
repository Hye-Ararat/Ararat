import axios from 'axios'
import Cookies from 'js-cookie'
async function getServerStatusData(uuid, callback){
    var status_data = await axios.get(`https://ararat-backend.hyehosting.com/server/${uuid}/minecraft?token=${Cookies.get('token')}`)
    callback(status_data.data)
}
export default getServerStatusData