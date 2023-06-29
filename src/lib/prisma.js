const {PrismaClient} = require("@prisma/client")

/**
 * @type {PrismaClient}
 */
let prisma;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

/**
 * @type {PrismaClient}
 */
module.exports = prisma;