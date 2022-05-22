import { action, createContextStore } from "easy-peasy";

export const NodeStore = createContextStore({
    data: null,
    setData: action((state, payload) => {
        state.data = payload
    }),
    sockets: {
        state: null,
        setState: action((state, payload) => {
            state.state = payload
        }),
        console: null,
        setConsole: action((state, payload) => {
            state.console = payload
        })
    }
})