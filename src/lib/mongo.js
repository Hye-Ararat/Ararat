const { MongoClient } = require("mongodb");
/**
 * @type {MongoClient}
 */
let mongo

if (process.env.NODE_ENV === "production") {
    mongo = new MongoClient(process.env.DATABASE_URL);
} else {
    if (!global.mongo) {
        global.mongo = new MongoClient(process.env.DATABASE_URL);
    }
    mongo = global.mongo;
}

module.exports = mongo;