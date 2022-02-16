import { createDecipheriv } from "crypto"

export default function getNodeAccessToken(iv, encToken) {
    const decipher = createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(iv, "hex"));
    return Buffer.concat([decipher.update(Buffer.from(encToken.split("::")[1], "hex")), decipher.final()])
}