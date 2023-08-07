const prompts = require('prompts');
const { MongoClient } = require('mongodb')
require("dotenv").config({ "path": "./.env.local" })
const client = new MongoClient(process.env.DATABASE_URL);
(async () => {
    const { username } = await prompts({
        type: "text",
        name: 'username',
        message: 'What do you want the users email to be?'
    });
    const { firstname } = await prompts({
        type: "text",
        name: 'firstname',
        message: 'What do you want the users first name to be?'
    });
    const { lastname } = await prompts({
        type: "text",
        name: 'lastname',
        message: 'What do you want the users last name to be?'
    });
    const { password } = await prompts({
        type: "password",
        name: 'password',
        message: 'What do you want the password to be?'
    });
    const { password2 } = await prompts({
        type: "password",
        name: 'password2',
        message: 'Confirm your password'
    });
    if (password != password2) return process.exit(1);
    await client.connect()
    const user = await client.db().collection("User").findOne({ email: username })
    if (user) return console.log("That email is already in use")
    const bcrypt = require("bcrypt")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await client.connect()
    await client.db().collection("User").insertOne({
        email: username,
        password: hash,
        firstName: firstname,
        lastName: lastname
    })
    console.log(`User ${username} has been created`)
    process.exit(0)
})();
