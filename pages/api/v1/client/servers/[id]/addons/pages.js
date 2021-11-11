import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../../../util/mongodb";

export default async function handler(req, res) {
	const {
		query: { id },
	} = req;
    console.log(id);
	let { db } = await connectToDatabase();
    try {
    var server = await db.collection("servers").findOne({
        _id: ObjectId(id)
    })
} catch {
    return res.status(404).send({
        status: "error",
        data: "Server does not exist"
    })
}
    if (!server) {
        return res.status(404).send({status: "error", data: "Server does not exist"})
    }
    let magma_cube_id = server.magma_cube.cube;
	let magmaCube = await db
		.collection("magma_cubes")
		.findOne({ _id: ObjectId(magma_cube_id) });
	if (!magmaCube)
		return res.status(404).send({
			status: "error",
			data: "Magma Cube does not exist.",
		});
        function Pages() {
            return new Promise((resolve, reject) => {
                magmaCube.enhancements.map(async enhancement => {
                    let full_pages = [];
                    for (let i = 0; i <= magmaCube.enhancements.length; i++) {
                        var pages = await db.collection("addons").find({
                            magma_cube: magma_cube_id,
                            type: "page",
                            enhancement: enhancement
                        }).toArray()
                        if (i == magmaCube.enhancements.length) {
                            console.log("IT'S DONE")
                            console.log(full_pages);
                            return resolve(full_pages);
                        }
                        full_pages = full_pages.concat(pages);
                        console.log(full_pages)
                    }
                })
            })
        }
            return res.json({status: "success", data: await Pages()});
}
