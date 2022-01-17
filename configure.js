const readline = require('readline');
const fs = require("fs");
const crypto = require("crypto");
(async function setup() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var mongodb_uri;
    var mongodb_db;
    var panel_url;

    rl.question("What is your MongoDB URI? (Example: mongodb+srv://Example:Password@example.com/example)", (answer) => {
        mongodb_uri = answer;

        rl.question("What is your MongoDB DB name?", (answer) => {
            mongodb_db = answer;


            rl.question("What is this Ararat installation's panel URL (example: https://example.com)", (answer) => {
                panel_url = answer;
                rl.close();
                fs.writeFileSync(".env.local", `MONGODB_URI=${mongodb_uri}\nMONGODB_DB=${mongodb_db}\nENC_KEY=${crypto.randomBytes(20).toString("hex")}\nURL=${panel_url}`);

            })
        })
    });

})();