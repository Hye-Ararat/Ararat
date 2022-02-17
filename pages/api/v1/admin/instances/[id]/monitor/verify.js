export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  switch (method) {
    case "POST":
      if (!req.body.access_token) return res.status(400).send("Access Token is Required");
      if (!req.body.access_token.includes(":::")) return res.status(403).send("Not allowed to access this resource");
      const allowed = verify(req.body.access_token.split(":::")[1], process.env.ENC_KEY);
      if (!allowed) return res.status(403).send("Not allowed to access this resource");
      const token_data = decodeToken(req.body.access_token.split(" ")[1]);
      if (token_data.instance_id != id) return res.status(403).send("Not allowed to access this resource");
      if (token_data.type != "monitor_access_token") return res.status(403).send("Not allowed to access this resource");
      return res.status(204).send();
      break;
    default:
      res.status(400).json("Method not allowed");
  }
}
