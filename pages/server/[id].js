import { useRouter } from "next/router";
import Navigation from "../../components/server/Navigation";

export default function Server({data}) {
    const router = useRouter()
    const {id} = router.query
    return(
        <Navigation>
        <p>Hi</p>
        {id}
        </Navigation>
    )
}