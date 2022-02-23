import decodeToken from "../../../../../../../lib/decodeToken";

export default async function handler(req, res) {
  const { query: { id } } = req;
  const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
  if (tokenData.type != "monitor" || tokenData.instance != id) return res.status(403).send("Not allowed to access this resource");
  return res.status(204).send();
}
