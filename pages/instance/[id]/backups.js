import Navigation from "../../../components/instance/Navigation";
import { InstanceStore } from "../../../states/instance";
import { Typography } from "@mui/material";

export default function Backups(props) {
    return (
        <Typography variant="h4">Backups</Typography>
    )
}

Backups.getLayout = (page) => {
    return (
        <InstanceStore.Provider>
            <Navigation page="backups">
                {page}
            </Navigation>
        </InstanceStore.Provider>
    )
}