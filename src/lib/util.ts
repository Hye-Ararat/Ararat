import { LxdInstance, NodeLxdInstance } from "@/types/instance";

export function formatDate(date: Date) {
    var d = date
    var date_format_str = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + (((d.getMinutes() / 5) * 5).toString().length == 2 ? ((d.getMinutes() / 5) * 5).toString() : "0" + ((d.getMinutes() / 5) * 5).toString());
    return date_format_str
}
export function getBadgeColor(status: string) {
    switch (status) {
        case "Running":
            return "green";
        case "Error":
            return "red";
        case "Freezing":
            return "blue";
        case "Frozen":
            return "blue";
        case "Restarting":
            return "yellow";
        case "Starting":
            return "darkgreen";
        case "Stopped":
            return "red";
        case "Stopping":
            return "darkred";
        default:
            return "gray";
    }
}
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function relativeDirMove(backmoves: number) {
    const times = backmoves;
    var res = "./"
    for (let i = 0; i < times; i++) {
        res += "../"
    }
    return res;
}
export function getWsErrorMsg(code: number) {
    if (code == 1000)
        return "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
    if (code == 1001)
        return 'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
    if (code == 1002)
        return "An endpoint is terminating the connection due to a protocol error";
    if (code == 1003)
        return "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
    if (code == 1004)
        return "Reserved. The specific meaning might be defined in the future.";
    if (code == 1005) return "No status code was actually present.";
    if (code == 1006)
        return "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
    if (code == 1007)
        return "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
    if (code == 1008)
        return 'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
    if (code == 1009)
        return "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
    if (code == 1010)
        return "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake.";
    if (code == 1011)
        return "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
    if (code == 1015)
        return "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
    else return "Unknown reason";
};
export function isThisAFile(maybeFile: File) {
    return new Promise(function (resolve, reject) {
        if (maybeFile.type !== '') {
            return resolve(maybeFile)
        }
        const reader = new FileReader()
        reader.onloadend = () => {
            if (
                reader.error &&
                (
                    reader.error.name === 'NotFoundError' ||
                    reader.error.name === 'NotReadableError'
                )) {
                return reject(reader.error.name)
            }
            resolve(maybeFile)
        }
        reader.readAsBinaryString(maybeFile)
    })
}
