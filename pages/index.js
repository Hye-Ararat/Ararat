import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button, Typography, Grid } from "@mui/material";
import Link from "next/link";
import { connectToDatabase } from "../util/mongodb";
import Server from "../components/server";

export async function getServerSideProps(ctx) {
  const {db} = await connectToDatabase();
  const server_data = await db.collection("servers").aggregate([
    {
      $match: {[`users.616da13fe2f36f19e274a7ca`]: { $exists: true }}
    },
    {
      $addFields: { allocations: {
        main: {"$toObjectId": "$allocations.main"},
      },
    }
  },
  {
    $addFields: { node: {"$toObjectId": "$node"},
  }
},
  {
    $lookup: {
      from: "nodes",
      localField: "node",
      foreignField: "_id",
      as: "node_data"
    }
  },
    {
      $lookup: {
        from: "allocations",
        localField: "allocations.main",
        foreignField: "_id",
        as: "allocation_data"
      }
    },
  ]).toArray()
  let data = JSON.parse(JSON.stringify(server_data))
  return { props: { data } };
}

export default function Dashboard({ data }) {
	return (
		<>
    <Head>
      <title>Dashboard | Ararat</title>
    </Head>
    <Typography variant="h4" sx={{mb: 1}}>Your Servers</Typography>
    <Grid spacing={5} container direction="row">
    {data.map((server) => {
      return(
        <Server server={server} key={server._id} />
        )
      })}
      </Grid>
		</>
	);
}
