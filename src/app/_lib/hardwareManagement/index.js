import ipmiTool from "./ipmiTool.js";
import axios from "axios";
import https from "node:https";
import Ilo4 from "./ilo4/index.js";

async function loginIlo4(ip, username, password) {
  let client = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  const login = await client.post(`https://${ip}/json/login_session`, {
    method: "login",
    user_login: username,
    password: password,
  });
  return login.data.session_key;
}

export default class Server {
  constructor(brand, software, ipmiIp, ipmiUsername, ipmiPassword) {
    this.brand = brand;
    this.software = software;
    this.ipmiIp = ipmiIp;
    this.ipmiUsername = ipmiUsername;
    this.ipmiPassword = ipmiPassword;
    this.axiosClient = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  async getPowerStatus() {
    if (this.software == "iLO 4") {
      if (!this.ilo4Client) {
        this.ilo4Client = new Ilo4(
          this.ipmiIp,
          this.ipmiUsername,
          this.ipmiPassword
        );
      }
      return await this.ilo4Client.getPowerStatus();
    }
    const result = await ipmiTool(
      this.ipmiIp,
      this.ipmiUsername,
      this.ipmiPassword,
      "chassis power status"
    );
    return result.split("\n")[0].split("Chassis Power is ")[1];
  }
  async setPower(action) {
    const result = await ipmiTool(
      this.ipmiIp,
      this.ipmiUsername,
      this.ipmiPassword,
      `chassis power ${action}`
    );
    return result;
  }

  async logout() {
    if (this.software == "iLO 4") {
      return this.ilo4Client.logout();
    }
  }
}
