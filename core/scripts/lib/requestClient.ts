import nookies from "nookies";




let requestConfig : RequestInit = {
    method: "GET",
    headers: {
    }
}

export function post(url: string, config: RequestInit, token?: string) {
    if (token) requestConfig.headers["authorization"] = `Bearer ${token}`;
    requestConfig.method = "POST"
    let configHeaders = config.headers;
    delete config.headers;
    requestConfig = {
        ...requestConfig,
        ...config,
    }
    return new Promise(async (resolve, reject) => {
        if (configHeaders) {
            requestConfig.headers = {
                ...requestConfig.headers,
                ...configHeaders
            }
        }
        fetch(url, requestConfig).then(async res => {
            let dat = res;
            return resolve(dat);
        }).catch(err => {
            return reject(err)
        })      
    })

}