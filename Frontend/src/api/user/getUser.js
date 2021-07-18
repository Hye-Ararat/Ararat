import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
function getUser() {
    var user_info = jwt.decode(Cookies.get('token'))
    return(user_info)
}
export default getUser