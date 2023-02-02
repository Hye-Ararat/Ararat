import Client from "hyexd";

export default async function handler(req, res) {
    const { method, query: { id } } = req;
    const lxd = new Client("unix:///var/snap/lxd/common/lxd/unix.socket", null)
    switch (method) {
        case "GET":
            let networks = [];
            let networkList;
            try {
                networkList = await lxd.networks()
            } catch (error) {
                console.log(error)
                return res.status(400).send(error);
            }
            networkList.metadata.forEach((network, index) => {
                networkList.metadata[index] = network.replace("/1.0/networks/", "")
            })
            networkList.metadata.forEach(async (network, index) => {
                let e = await lxd.network(network).data
                networks.push(e.metadata)
            })
            //@ts-ignore
            function ready() {
                return new Promise((resolve, reject) => {
                    let interval = setInterval(() => {
                        if (networkList.metadata.length == networks.length) {
                            clearInterval(interval)
                            resolve(true)
                        }
                    }, 1)
                })
            }
            await ready();
            return res.status(200).send(
                {
                    ...networkList,
                    metadata: networks
                });
    }
}