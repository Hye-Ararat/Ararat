const express = require("express")
const websock = require("ws")
global.sockets = {};
async function operationSocketProxy() {
    const app = express();
    const expressWs = require("express-ws")(app);
    //@ts-ignore
    app.ws("/1.0/operations/:operation/websocket", (ws, req) => {
        console.log(global.sockets)
        if (!global.sockets[req.query.secret]) {
            const socket = new websock(`ws+unix:///var/snap/lxd/common/lxd/unix.socket:/1.0/operations/${req.params.operation}/websocket?secret=${req.query.secret}`);
            socket.onclose = () => {
                delete global.sockets[req.query.secret];
            }
            global.sockets[req.query.secret] = {
                connections: 0,
                socket: socket
            }
        }
        global.sockets[req.query.secret].connections += 1;
        global.sockets[req.query.secret].socket.addEventListener("message", (data) => {
            ws.send(data.data, { binary: true });
        })
        ws.on("message", (data) => {
            global.sockets[req.query.secret].socket.send(data, { binary: true });
        })
        ws.on("close", () => {
            let number = global.sockets[req.query.secret].connections;
            if (number == 1) {
                global.sockets[req.query.secret].socket.close();
                delete global.sockets[req.query.secret];
            } else {
                global.sockets[req.query.secret].connections -= 1;
            }
        })
    })
    app.listen(3004);

}

operationSocketProxy();