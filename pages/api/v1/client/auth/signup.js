const { connectToDatabase } = require("../../../../../util/mongodb");


export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case 'POST': {
      var { db } = await connectToDatabase();
      let user_data = await db.collection('users').findOne({
        email: req.body.email,
      });
      if (user_data)
        return res
          .status(401)
          .json({ status: 'error', data: 'That email already exists' });

      let hashedPassword = bcryptjs.hash(res.body.password, 10);

      function getRandomString(length) {
        var randomChars =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
          result += randomChars.charAt(
            Math.floor(Math.random() * randomChars.length)
          );
        }
        return result;
      }

      const user = {
        username: res.body.username,
        first_name: res.body.first_name,
        last_name: res.body.last_name,
        admin: false,
        email: res.body.email,
        password: hashedPassword,
        preferences: Array,
        refresh_token: getRandomString(32),
        phone_number: Null,
      };
      await db.insertOne(user);
    }
  }
}
