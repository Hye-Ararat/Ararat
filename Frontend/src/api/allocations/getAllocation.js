import axios from 'axios'
import Cookies from 'js-cookie'
async function getAllocation(allocation, callback){
    var allocation_data = (await axios.get(`https://ararat-backend.hyehosting.com/allocation/${allocation}?token=${Cookies.get('token')}`)).data
    console.log(allocation_data)
    callback(allocation_data)
}
export default getAllocation