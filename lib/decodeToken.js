import { decode } from "jsonwebtoken";

export default function decodeToken(key) {
    let token;
    if (key.includes("::")) token = key.split("::")[1];
    if (key.includes(":")) token = key.split(":")[1];
    if (!token) token = key;
    return decode(token);
}