const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

const ImageServers = [
    {
        name: "Ubuntu",
        address: "https://cloud-images.ubuntu.com/releases",
        protocol: "simplestreams"
    },
    {
        name: "LinuxContainers",
        address: "https://images.linuxcontainers.org",
        protocol: "simplestreams"
    }
]


async function seed() {
    console.log("Seeding Database");
    ImageServers.forEach(async imageServer => {
        const imageServerData = await prisma.imageServer.create({
            data: imageServer
        })
        console.log(`Added Image Server with id of ${imageServerData.id}`);
    })
    console.log("Seeding complete")
}

seed().catch((e) => {
    console.log(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})