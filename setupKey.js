const fs = require("fs");
const generateKeyPair = require("jose").generateKeyPair;
const exportJWK = require("jose").exportJWK;

async function setupKey() {
    console.log("Checking for key...");
    if (fs.existsSync("./key")) {
        console.log("Key found!");
        return;
    };
    console.log("No key found, generating...");
    const keypair = await generateKeyPair("RS256");
    const jwk = await exportJWK(keypair.privateKey);
    fs.writeFileSync("./key", JSON.stringify(jwk));
    console.log("Key generated!");
    return;
}
setupKey();