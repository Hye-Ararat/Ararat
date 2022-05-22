import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Navigation from "../../../components/node/navigation";
import { NodeStore } from "../../../states/node";


export default function StoragePools({ node }) {
    const router = useRouter();
    return (
        <Grid container direction="row" sx={{ mb: 2 }}>
            <Grid container xs={4}>
                <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>Storage Pools</Typography>
            </Grid>
        </Grid>
    )
}

StoragePools.getLayout = (page) => {
    return (
        <NodeStore.Provider>
            <Navigation page="storage-pools">{page}</Navigation>
        </NodeStore.Provider>
    )
}