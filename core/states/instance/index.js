import { action, createContextStore } from "easy-peasy"

export const InstanceStore = createContextStore({
    data: null,
    setData: action((state, payload) => {
        state.data = payload
    }),
    monitor: {
        state: null,
        cpu: {
            usage: null,
        },
        swap: {
            usage: null
        },
        memory: {
            usage: null,
            percent: null
        },
        disk: {
            usage: null
        },
        containerState: null
    },
    setMonitor: action((state, payload) => {
        state.monitor = payload
    }),
    containerState: null,
    setContainerState: action((state, payload) => {
        if (state.containerState != payload) {
            state.containerState = payload;
        }
    }),
    sockets: {
        monitor: null,
        setMonitor: action((state, payload) => {
            state.monitor = payload
        }),
        console: null,
        setConsole: action((state, payload) => {
            state.console = payload
        }),
        consoleReady: false,
        setConsoleReady: action((state, payload) => {
            state.consoleReady = payload
        }),
        control: null,
        setControl: action((state, payload) => {
            state.control = payload
        }
        )
    }
})