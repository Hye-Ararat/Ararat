const { connectToDatabase } = require("../../../../../util/mongodb");
import axios from "axios";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "POST": {
      var { db } = await connectToDatabase();
      let user_data = await db.collection("users").findOne({
        email: req.body.email
      });
      if (user_data) return res.json({ status: "error", data: "That email already exists" });
      try {
        var salt = await bcrypt.genSalt(10);
        var hashedPassword = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json({ status: "error", data: "An error occured hile creating the user" });
      }

      const user = {
        username: req.body.username,
        first_name: req.body.name,
        last_name: req.body.surname,
<<<<<<< Updated upstream
=======
        admin: false,
>>>>>>> Stashed changes
        email: req.body.email,
        password: hashedPassword,
        phone_number: null
      };
      await db.collection("users").insertOne(user);
      return res.json({
        status: "Success",
        data: "User created successfully"
      });
      break;
    }
    default: {
      res.status(400).send({
        status: "error"
      });
    }
  }
}
