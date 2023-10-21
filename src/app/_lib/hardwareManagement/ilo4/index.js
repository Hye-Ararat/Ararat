import axios from "axios";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export default class Ilo4 {
  constructor(ip, username, password) {
    this.ip = ip;
    this.username = username;
    this.password = password;
    this.client = new axios.create({
      rejectUnauthorized: false,
      baseURL: `https://${ip}`,
    });
  }
  async login() {
    return new Promise((resolve, reject) => {
      this.client
        .post("/rest/v1/SessionService/Sessions", {
          UserName: this.username,
          Password: this.password,
        })
        .then((res) => {
          var token = res.headers["x-auth-token"];
          if (!token) return reject(new Error("No token returned"));
          this.session = token;
          this.location = res.headers["location"];
          resolve(token);
        })
        .catch((err) => {
          console.log(JSON.stringify(err.response.data));
          reject(err);
        });
    });
  }
  async getPowerStatus() {
    return new Promise(async (resolve, reject) => {
      if (!this.session) var token = await this.login();
      else var token = this.session;
      this.client
        .get("/rest/v1/Systems/1", {
          headers: {
            "X-Auth-Token": token,
          },
        })
        .then((res) => {
          resolve(res.data.PowerState.toLowerCase());
        })
        .catch((err) => reject(err));
    });
  }
  async logout() {
    return new Promise((resolve, reject) => {
      this.client
        .delete(this.location, {
          headers: {
            "X-Auth-Token": this.session,
          },
        })
        .then((res) => {
          resolve();
        })
        .catch((err) => reject(err));
    });
  }
}
