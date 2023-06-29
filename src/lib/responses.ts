function translateCode(code: number): string | null {
    switch (code) {
        case 100:
            return "Operation created"
        case 101:
            return "Started"
        case 102:
            return "Stopped"
        case 103:
            return "Running"
        case 104:
            return "Cancelling"
        case 105:
            return "Pending"
        case 106:
            return "Starting"
        case 107:
            return "Stopping"
        case 108:
            return "Aborting"
        case 109:
            return "Freezing"
        case 110:
            return "Frozen"
        case 111:
            return "Thawed"
        case 112:
            return "Error"
        case 200:
            return "Success"
        case 400:
            return "Failure"
        case 401:
            return "Cancelled"
        default:
            return null
    }
}

export function standardResponse(status: number, status_code: number, metadata?: any) {
    let response: {
        "type": string,
        "status": string | null | number,
        "status_code": number,
        "metadata"?: any
    } = {
        "type": "sync",
        "status": translateCode(status) ? translateCode(status) : status,
        "status_code": status_code ? status_code : typeof status == "number" ? status : 200,
    }
    if (metadata) response.metadata = metadata;
    return response;
}

export function backgroundResponse(status: number, operation:any, status_code: number, metadata?:any) {
    let response: {
        "type": string,
        "status": string | null | number,
        "status_code": number,
        "operation": any,
        "metadata"?: any
    } = {
        "type": "async",
        "status": translateCode(status) ? translateCode(status) : status,
        "status_code": status_code ? status_code : typeof status == "number" ? status : 100,
        "operation": operation,
    }
    if (metadata) response.metadata = metadata;
    return response;
}


export function errorResponse(error:number, status:number, metadata?:any) {
    let response: {
        "type": string,
        "error": string | null | number,
        "error_code": number,
        "metadata"?: any
    } = {
        "type": "error",
        "error": translateCode(error) ? translateCode(error) : error,
        "error_code": typeof error == "number" ? error : status ? status : 400,
    }
    if (metadata) response.metadata = metadata;
    return response;
}