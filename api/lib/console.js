export function add(name, stdin, stdout) {
    global.sockets.push({ name, socket: { stdin, stdout } });
    return global.sockets.length;
}

export function get(name) {
    return global.sockets.find(socket => socket.name === name);
}

export function remove(name) {
    global.sockets = global.sockets.filter(socket => socket.name !== name);
    return global.sockets.length;
}

export function set(newSockets) {
    global.sockets = newSockets;
    return global.sockets;
}