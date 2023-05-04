"use client";

import { InstanceStore } from "../../states/instance/index";

export default function CacheProvider({children}) {
    return (
        <InstanceStore.Provider>
        {children}
        </InstanceStore.Provider>
    )
}