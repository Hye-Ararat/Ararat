//import useSWR from "swr";
//import axios from "axios";
import { memo } from "react";

function Spice(props) {
	//const fetcher = (url) => axios.get(url).then((res) => res.data);
    //const {data, error} = useSWR("/api/v1/client/instances/" + props.instance._id + "/console/ws", fetcher)
    return (
        <iframe height="550px" width="100%" frameBorder="0" src={`${props.instance.relationships.node.address.ssl ? "https://" : "http://"}${props.instance.relationships.node.address.hostname}:${props.instance.relationships.node.address.port}/api/v1/instances/61d1f283396fc0779ee1e2f8/console`} />
    )
}
function areEqual(prevProps, nextProps) {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
export default memo(Spice, areEqual)