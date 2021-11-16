import { destroyCookie, setCookie } from "nookies";

export default function signOut() {
    return new Promise((resolve, reject) => {
    try {
        setCookie(null, "access_token", "");
        destroyCookie(null, "access_token");
        document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        setCookie(null, "refresh_token", "")
        destroyCookie(null, "refresh_token");  
        document.cookie = "refresh_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        resolve(true)
    } catch (error) {
reject(false);
    }
});
}