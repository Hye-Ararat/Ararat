import axios from "axios";
import Cookies from "js-cookie";

function getNode(node) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_BASALT_URL}/api/v1/client/nodes/${node}`, {
        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
      })
      .then((node_response) => {
        let node_data = node_response.data;
        if (node_data.status == "error") return reject(Error(node_data.data));
        return resolve(node_data.data);
      });
  });
}

export default getNode;
