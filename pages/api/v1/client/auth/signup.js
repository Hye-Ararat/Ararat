import bcrypt from "bcryptjs";
import prisma from "../../../../../lib/prisma"
export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "POST":
      let salt;
      let hashedPassword;
      try {
        salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).send("An error occured hile creating the user");
      }


      let user;
      try {
        user = await prisma.user.create({
          data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
          }
        })
      } catch {
        return res.status(500).send("Internal Server Error")
      }

      return res.status(200).send(user);
      break;
    default: {
      res.status(400).send("Method not allowed");
    }
  }
}
