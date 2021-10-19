import axios from "axios";
import Cookies from "js-cookie";

function getServers() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_BASALT_URL}/api/v1/client/servers`, {
        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
      })
      .then((servers_response) => {
        let server_data = servers_response.data;
        if (server_data.status == "error")
          return reject(Error(servers_response.data));
        return resolve(server_data.data);
      });
  });
}

export default getServers;
