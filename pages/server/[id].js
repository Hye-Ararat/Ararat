import { useRouter } from "next/router";
import Navigation from "../../components/server/Navigation";
import { connectToDatabase } from "../../util/mongodb";
import { ObjectId } from "mongodb";
import { Typography } from "@mui/material";

export async function getServerSideProps(ctx) {
	const { db } = await connectToDatabase();
	const server_data = await db.collection("servers").findOne({
		[`users.616da13fe2f36f19e274a7ca`]: { $exists: true },
		_id: ObjectId(ctx.query.id),
	});
	let data = JSON.parse(JSON.stringify(server_data));
	return { props: { data } };
}

export default function Server({ data }) {
	const router = useRouter();
	const { id } = router.query;
	return (
		<Navigation server={id}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {data.name}
          </Typography>
          			{id}
		</Navigation>
	);
}
