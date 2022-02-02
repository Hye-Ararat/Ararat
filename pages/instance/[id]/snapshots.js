import Navigation from "../../../components/instance/Navigation"
import { InstanceStore } from "../../../states/instance"

export default function Snapshots(req, res) {
    return (
        <p>This is the snapshots page!!!!</p>
    )
}

Snapshots.getLayout = (page) => {
    return (
        <InstanceStore.Provider>
            <Navigation page="snapshots">
                {page}
            </Navigation>
        </InstanceStore.Provider>
    )
}