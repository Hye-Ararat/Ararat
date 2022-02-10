import Navigation from "../../components/admin/Navigation"

export default function Admin() {
    return (
        <>
            <p>Admin</p>
        </>
    )
}

Admin.getLayout = function getLayout(page) {
    return (
        <Navigation>
            {page}
        </Navigation>
    )
}   