const readline = require('readline');
const fs = require("fs");
const crypto = require("crypto");
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcryptjs");

(async function setup() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let mongodb_uri;
    let mongodb_db;
    let panel_url;

    console.log("Let's get your Ararat instance configured.");

    rl.question("What is this Ararat installation's panel URL? (example: https://araratdev.hye.gg) ", (answer) => {
        panel_url = answer;
        rl.question("What is your MongoDB URI? (Example: mongodb+srv://Example:Password@example.com)", (answer) => {
            mongodb_uri = answer;

            rl.question("Have you already setup your MongoDB database? (y/n)", (answer) => {
                if (answer.includes("n")) {
                    rl.question("What would you like your database to be named? (Example: Ararat) ", (answer) => {
                        mongodb_db = answer;
                        MongoClient.connect(mongodb_uri + "/" + mongodb_db, async (err, db) => {
                            if (err) throw err;
                            console.log("Database Created!");
                            let database = db.db(mongodb_db);

                            console.log("Creating Collections");
                            let collections = ["users", "instances", "magma_cubes", "networks", "ports", "nodes"];
                            collections.forEach(async (collection) => {
                                try {
                                    await database.createCollection(collection);
                                } catch (error) {
                                    throw new Error(error);
                                }
                            });
                            console.log("Collections Created!");


                            console.log("In order to use Ararat, you must create an administrative user. This user will have ALL administrative privileges.");

                            let username;
                            let email;
                            let password = crypto.randomBytes(20).toString("hex");
                            let first_name;
                            let last_name;
                            rl.question("What would you like your username to be? (Example: admin)", (answer) => {
                                username = answer;
                                rl.question("What would you like this user's email to be? (example: example@hye.gg) ", (answer) => {
                                    email = answer;
                                    rl.question("What is this user's first name?", (answer) => {
                                        first_name = answer;
                                        rl.question("What is this user's last name?", async (answer) => {
                                            last_name = answer;
                                            console.log("Creating User");
                                            const salt = await bcrypt.genSalt(10);
                                            const hashedPassword = await bcrypt.hash(password, salt);
                                            try {
                                                await database.collection("users").insertOne({
                                                    username: username,
                                                    first_name: first_name,
                                                    last_name: last_name,
                                                    admin: {
                                                        nodes: {
                                                            read: true,
                                                            write: true
                                                        },
                                                        networks: {
                                                            read: true,
                                                            write: true
                                                        },
                                                        magma_cubes: {
                                                            read: true,
                                                            write: true
                                                        },
                                                        instances: {
                                                            read: true,
                                                            write: true
                                                        },
                                                        users: {
                                                            read: true,
                                                            write: true
                                                        }
                                                    },
                                                    email: email,
                                                    password: hashedPassword
                                                })
                                            } catch (error) {
                                                throw new Error(error);
                                            }
                                            console.log("User Created");
                                            console.log("This user's password is " + password + " it can be changed later in the panel, however, for the time being, DO NOT FORGET THIS PASSWORD!");
                                            rl.close();
                                            console.log("Saving panel configuration");
                                            fs.writeFileSync(".env.local", `MONGODB_URI=${mongodb_uri}\nMONGODB_DB=${mongodb_db}\nENC_KEY=${crypto.randomBytes(16).toString("hex")}\nURL=${panel_url}`);
                                            console.log("Saved.");
                                            console.log("Setup Complete!");
                                            process.exit(0);
                                        })
                                    })
                                })

                            });

                        });
                    })
                } else {
                    rl.question("What is your MongoDB DB name?", (answer) => {
                        mongodb_db = answer;
                        rl.close();
                        console.log("Saving panel configuration");
                        fs.writeFileSync(".env.local", `MONGODB_URI=${mongodb_uri}\nMONGODB_DB=${mongodb_db}\nENC_KEY=${crypto.randomBytes(16).toString("hex")}\nURL=${panel_url}`);
                        console.log("Saved.");
                        console.log("Setup Complete!");
                        process.exit(0);
                    })
                }
            })
        });
    });

})();