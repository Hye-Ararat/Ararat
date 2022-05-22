import { createDecipheriv } from "crypto"

export default function getNodeEnc(iv, encToken) {
    const decipher = createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(iv, "hex"));
    return Buffer.concat([decipher.update(Buffer.from(encToken, "hex")), decipher.final()])
}