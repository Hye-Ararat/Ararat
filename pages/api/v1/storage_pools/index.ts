import Client from "hyexd";

export default async function handler(req, res) {
    const { method, query: { id } } = req;

    const lxd = new Client("unix:///var/snap/lxd/common/lxd/unix.socket", null)
    switch (method) {
        case "GET":
            let storage_pools = [];
            let pools;
            try {
                pools = await lxd.storagePools()
            } catch (error) {
                console.log(error)
                return res.status(500).send(error);
            }
            pools.metadata.forEach((pool, index) => {
                pools.metadata[index] = pool.replace("/1.0/storage-pools/", "")
            })
            pools.metadata.forEach(async (pool, index) => {
                let e = await lxd.storagePool(pool).data
                storage_pools.push(e.metadata)
            })
            function ready() {
                return new Promise((resolve, reject) => {
                    let interval = setInterval(() => {
                        if (pools.metadata.length == storage_pools.length) {
                            clearInterval(interval)
                            resolve(storage_pools)
                        }
                    }, 1)
                })
            }
            await ready();
            console.log(pools)
            return res.status(200).send(
                {
                    ...pools,
                    metadata: storage_pools
                });
    }
}