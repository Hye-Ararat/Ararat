const prompts = require("prompts");
const { exec, execSync } = require("child_process");
const { genSalt, hash } = require("bcryptjs");
const fs = require("fs");
const cron = require("node-cron");
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
(async function setup() {
    const log = async (s) => {
        return new Promise(async (resolve, reject) => {
            for (const c of s) {
                process.stdout.write(c);
                await sleep(20);
            }
            await sleep(1000);
            process.stdout.write('\n');
            resolve();
        });
    }
    await log("Hello! Welcome to Ararat!");
    await log("This is the setup wizard for Ararat. It will help you configure your Ararat instance.");
    await log("Before we begin, please make sure you have either a PostgreSQL or CockroachDB database ready to use.");
    const dbReady = await prompts({
        type: "confirm",
        name: "value",
        message: "Do you have a database ready for Ararat to seed?"
    })
    if (!dbReady.value) {
        await log("Please setup a database and then run this setup wizard again.");
        process.exit(1);
    }
    await log("Let's get started!");
    await log("First, we need to configure your database.");
    const dbType = await prompts({
        type: "select",
        name: "value",
        message: "What database type do you want to use?",
        choices: [
            { title: "PostgreSQL", value: "postgresql" },
            { title: "CockroachDB", value: "cockroachdb" },
        ]
    });
    let env = "";
    if (dbType.value == "postgresql") {
        let schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
        schema = schema.replaceAll("sequence()", "autoincrement()");
        schema = schema.replaceAll("cockroachdb", "postgresql");
        fs.writeFileSync("./prisma/schema.prisma", schema);
    }
    await log("✅ Great! Now let's get connected to your database.");
    const connectionString = await prompts({
        type: "text",
        name: "value",
        message: "Please enter your database connection string (postgresql://user:password@host:port/database)"
    });
    env += `DATABASE_URL=${connectionString.value}\n`;
    await log("One moment while I seed your database...");
    fs.writeFileSync("./.env", env);
    execSync("npx prisma db push", { stdio: "inherit" });
    await log("✅ Great! Your database is now seeded.");
    const randomString = () => {
        const length = 32;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
    }
    let envLocal = "";
    envLocal += `ENC_KEY=${randomString()}\n`;
    const ssl = await prompts({
        type: "select",
        name: "value",
        message: "Are you going to be using SSL?",
        choices: [
            { title: "True", value: "true" },
            { title: "False", value: "false" },
        ]
    });
    if (ssl.value == "true") {
        envLocal += `ssl=true\n`;
        fs.writeFileSync("./.env.local", envLocal);
        await log("Cool! It should be noted that Ararat does setup SSL for you. You will not need to setup SSL yourself.");
        const domain = await prompts({
            type: "text",
            name: "value",
            message: "What domain is this Ararat instance going to be running on? (e.g. ararat.hye.gg)"
        });
        envLocal += `PANEL_DOMAIN=${domain.value}\n`;
        fs.writeFileSync("./.env.local", envLocal);
        exec('sudo apt-get install -y nginx')
        exec('rm /etc/nginx/sites-enabled/default')
        exec('sudo apt-get install -y certbot python3-certbot-nginx')
        execSync('wget -O /etc/nginx/sites-available/ararat.conf https://raw.githubusercontent.com/OxyZachary/Ararat/master/ararat.conf', { stdio: [0, 1, 2] });
        let conf = fs.readFileSync("/etc/nginx/sites-available/ararat.conf", "utf8");
        conf = conf.replaceAll("example.com", `${domain.value}`);
        fs.writeFileSync("/etc/nginx/sites-available/ararat.conf", conf);
        exec(`certbot --nginx -d ${domain.value}`);
        exec('sudo ln -s /etc/nginx/sites-available/ararat.conf /etc/nginx/sites-enabled/ararat.conf')
        exec('systemctl restart nginx');
        cron.schedule('0 23 * * *', () => {
            exec("certbot renew --quiet")
            exec("systemctl restart nginx")
        })
    }
    const url = await prompts({
        type: "text",
        name: "value",
        message: "What url is this Ararat instance going to be running on? (e.g. https://ararat.hye.gg)"
    });
    envLocal += `PANEL_URL=${url.value}\n`;
    fs.writeFileSync("./.env.local", envLocal);
    await log("✅ Great! Your Ararat instance is now configured.");
    await log("One last thing before we finish up.");
    const userAccount = await prompts({
        type: "confirm",
        name: "value",
        message: "Would you like to create a user account with permission to assign permissions to themselves now?"
    });
    if (userAccount.value) {
        await log("Great! Let's get started.");
        const firstName = await prompts({
            type: "text",
            name: "value",
            message: "What is the first name of this account holder?",
        });
        const lastName = await prompts({
            type: "text",
            name: "value",
            message: "What is the last name of this account holder?",
        });
        const email = await prompts({
            type: "text",
            name: "value",
            message: "What is the email of this account holder?",
        });
        const username = await prompts({
            type: "text",
            name: "value",
            message: "What username would you like to use?"
        });
        async function askPass() {
            return new Promise(async (resolve, reject) => {
                password = await prompts({
                    type: "password",
                    name: "value",
                    message: "What password would you like to use?"
                });
                passwordConfirm = await prompts({
                    type: "password",
                    name: "value",
                    message: "Please confirm your password."
                });
                if (password.value != passwordConfirm.value) {
                    await log("Passwords do not match. Please try again.");
                    askPass();
                }
                if (password.value == passwordConfirm.value) {
                    resolve(password.value);
                }
            });
        }
        await askPass();
        await log("One moment while I create your account...");
        const { PrismaClient } = require("@prisma/client");
        const prisma = new PrismaClient();
        let salt = await genSalt(10);
        let hashedPassword = await hash(password.value, salt);
        let user = await prisma.user.create({
            data: {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                username: username.value,
                password: hashedPassword,
            }
        })
        let permission = await prisma.permission.create({
            data: {
                permission: "edit-users_user",
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })
        await log("✅ Great! Your account has been created.");
    }
    await log("✅ Great! That's it. Your Ararat instance is now configured. You can get started by running npm run build and then npm run start.");
    process.exit()
}());
