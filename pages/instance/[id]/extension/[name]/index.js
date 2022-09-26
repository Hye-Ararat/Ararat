import { CircularProgress, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Footer from "../../../../../components/footer"
import Navigation from "../../../../../components/instance/Navigation"
import { InstanceStore } from "../../../../../states/instance"
import nookies from "nookies";
import ExtensionPage from "../../../../../components/instance/ExtensionPage"
import { useRouter } from "next/router"

export default function Extension() {
    const [ready, setReady] = useState(false)
    const [imageId, setImageId] = useState(null);
    const instance = {
        data: InstanceStore.useStoreState((state) => state.data),
    }
    const router = useRouter()
    return (
        instance.data ?
            <>
                <ExtensionPage image={instance.data.config} extension={router.query.name} />
            </>
            : <Grid container direction="column">
                <CircularProgress sx={{ mr: "auto", ml: "auto" }} />
                <Typography align="center">One moment while we load this experience.</Typography>
            </Grid>
    )
}

Extension.getLayout = (page, query) => {
    return (
        <InstanceStore.Provider>
            <Navigation page={`extension-${query.name}`}>{page}<Footer /></Navigation>
        </InstanceStore.Provider>
    )
}