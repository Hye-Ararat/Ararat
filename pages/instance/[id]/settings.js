import Footer from "../../../components/footer"
import Navigation from "../../../components/instance/Navigation"
import { InstanceStore } from "../../../states/instance"

export default function Settings() {
    return (
        <p>Settings</p>
    )
}

Settings.getLayout = (page) => {
    return (
        <InstanceStore.Provider>
            <Navigation page="settings">
                {page}
                <Footer />
            </Navigation>
        </InstanceStore.Provider>
    )
}