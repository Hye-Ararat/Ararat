import axios from 'axios'
import Cookies from 'js-cookie'
async function getGeoNode(callback){
    var node_data = await axios.get(`https://ararat-backend.hyehosting.com/node`)
    callback(node_data.data)
}
export default getGeoNode