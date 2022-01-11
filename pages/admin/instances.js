import Navigation from "../../components/admin/Navigation"

export default function Instances() {
    return (
        <>
            <p>Instances</p>
        </>
    )
}

Instances.getLayout = function getLayout(page) {
    return (
        <Navigation page="instances">
            {page}
        </Navigation>
    )
}