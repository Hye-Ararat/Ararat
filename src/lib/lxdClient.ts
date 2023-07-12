export function openWebsocket(url: string, path: string) {
    var u = new URL(url)
    return new WebSocket("wss://" + u.host + "/1.0" + path)
}