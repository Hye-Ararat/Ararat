import {action, createContextStore} from "easy-peasy";

export const InstanceStore = createContextStore({
    state: {
        status: null,
        cpu: {
            usage: null
        },
        disk: null,
        memory: {
            usage: null,
            usage_peak: null,
            swap_usage: null,
            swap_usage_peak: null
        },
        network: null,
        status_code: null,
        pid: null,
        processes: null,
        
    }
});