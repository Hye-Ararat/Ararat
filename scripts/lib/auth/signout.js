import { destroyCookie } from "nookies";

export default function signOut() {
    try {
        destroyCookie(null, "access_token");
        destroyCookie(null, "refresh_token");  
        return true; 
    } catch (error) {
        return false;
    }
}