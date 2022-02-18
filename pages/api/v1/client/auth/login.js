import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "POST":
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email
        },
        include: {
          permissions: {
            select: {
              permission: true
            }
          }
        }
      })
      if (!user) return res.status(401).send("Incorrect email/username or password.");

      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) return res.status(401).send("Incorrect email/username or password.");
      let permissions = [];
      user.permissions.forEach(async permission => {
        permissions.push(permission.permission);
      });

      const refresh_token = jwt.sign(
        {
          type: "refresh",
          user: user.id
        },
        process.env.ENC_KEY,
        {
          algorithm: "HS256",
          expiresIn: "7d"
        }
      );
      const access_token = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: permissions
      }, process.env.ENC_KEY, {
        algorithm: "HS256",
        expiresIn: "15m"
      });

      return res.json({
        refresh_token: refresh_token,
        access_token: access_token
      });
      break;
    default: {
      res.status(400).send("Method not allowed");
    }
  }
}
