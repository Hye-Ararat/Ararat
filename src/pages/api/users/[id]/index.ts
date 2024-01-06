import { NextApiRequest, NextApiResponse } from "next";
import mongo from "@/lib/mongo";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.headers.authorization != process.env.ENC_KEY) {
        res.status(401).send("Unauthorized");
        return;
    }
    if (req.method == "DELETE") {
        const id = req.query.id?.toString()
        await mongo.db().collection("User").deleteOne({ _id: new ObjectId(id) })
        res.status(200).send("Success");
    }
    if (req.method == "PATCH") {
        const id = req.query.id?.toString()
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        console.log(id)
        let foundUser = await mongo.db().collection("User").findOne({ _id: new ObjectId(id) })
        let useEmail = false;
        if (!foundUser) {
            useEmail = true;
            foundUser = await mongo.db().collection("User").findOne({ email: id })
        }
        if (!useEmail) {
            await mongo.db().collection("User").updateOne({ _id: new ObjectId(id) }, {
                $set: {
                    email: req.body.email,
                    password: hash,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName

                }
            })
        } else {
            await mongo.db().collection("User").updateOne({ email: id }, {
                $set: {
                    email: req.body.email,
                    password: hash,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName

                }
            })
        }
        res.status(200).send("Success");
    }
    if (req.method == "GET") {
        const id = req.query.id?.toString()
        let foundUser;
        if (id?.includes("@")) {
            foundUser = await mongo.db().collection("User").findOne({ email: id })
        } else {
            foundUser = await mongo.db().collection("User").findOne({ _id: new ObjectId(id) })
        }

        if (foundUser) {
            res.status(200).json({
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                id: foundUser._id
            })
        } else {
            res.status(404).send("Not found")
        }
    }
}