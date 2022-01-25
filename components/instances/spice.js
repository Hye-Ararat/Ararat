//import useSWR from "swr";
//import axios from "axios";
import axios from "axios";
import { memo, useEffect, useState } from "react";

function Spice(props) {
  //const fetcher = (url) => axios.get(url).then((res) => res.data);
  //const {data, error} = useSWR("/api/v1/client/instances/" + props.instance._id + "/console/ws", fetcher)
  const [authToken, setAuthToken] = useState(null);
  useEffect(() => {
    axios.get(`/api/v1/client/instances/${props.instance._id}/console/ws`).then((res) => {
      setAuthToken(res.data);
    });
  }, []);
  return authToken ? (
    <iframe
      height="550px"
      width="100%"
      frameBorder="0"
      src={`${props.instance.relationships.node.address.ssl ? "https://" : "http://"}${
        props.instance.relationships.node.address.hostname
      }:${props.instance.relationships.node.address.port}/api/v1/instances/${
        props.instance._id
      }/console?auth=${authToken}`}
    />
  ) : (
    "Loading..."
  );
}
function areEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
export default memo(Spice, areEqual);
