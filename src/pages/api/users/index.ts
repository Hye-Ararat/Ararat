import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcrypt";
import mongo from "@/lib/mongo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        console.log(req.body)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        await mongo.db().collection("User").insertOne({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        res.status(200).send("Success")
    }
}