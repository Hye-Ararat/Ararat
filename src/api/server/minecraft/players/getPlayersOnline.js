import axios from 'axios'
import Cookies from 'js-cookie'
async function getPlayersOnline(uuid, callback){
    var player_data = await axios.get(`https://ararat-backend.hyehosting.com/server/players/${uuid}?token=${Cookies.get('token')}`)
    callback(player_data.data)
}
export default getPlayersOnline