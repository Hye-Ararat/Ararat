import { Typography, Dialog, DialogTitle, DialogContent, TextField, Grid, Divider, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";


export default function StatelessConf({ setPage, imageData, setConfig, config }) {
    const [render, setRender] = useState(false);
    useEffect(() => {
        if (imageData.imageDat.properties) {
            let currentConf = config;
            if (imageData.imageDat.properties["startup"]) {
                currentConf["user.startup"] = imageData.imageDat.properties["startup"];
            }
            if (imageData.imageDat.properties["environment"]) {
                imageData.imageDat.properties["environment"].forEach((envi, index) => {
                    currentConf[`environment.${envi.key}`] = envi.value.toString();
                })
            }
            if (imageData.imageDat.properties["user"]) currentConf["user.user"] = imageData.imageDat.properties["user"].toString();
            if (imageData.imageDat.properties["working_dir"]) currentConf["user.working_dir"] = imageData.imageDat.properties["working_dir"];
            setConfig(currentConf);
            setRender(true)
        }
    }, [])
    function convertEnvToReadable(string) {
        let done = string.split("_").join(" ").toLowerCase();
        done = done.split(" ").map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
        return done;
    }
    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant="h6" align="center" fontFamily="Poppins">Configure Stateless N-VPS</Typography>
            </DialogTitle>
            <DialogContent sx={{ minWidth: 450 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography sx={{ mb: 1 }} fontWeight={500} align="center" variant="h6" fontFamily="Poppins">Environment Variables</Typography>
                {imageData.imageDat.properties ? imageData.imageDat.properties["environment"] ?
                    imageData.imageDat.properties["environment"].map((envi, index) => {
                        return (
                            <>
                                <Grid container>
                                    <Typography variant="h6" fontFamily="Poppins">{convertEnvToReadable(envi.key)}</Typography>
                                    <TextField onChange={(e) => {
                                        setConfig({ ...config, [`environment.${envi.key}`]: e.target.value ? e.target.value : "" })
                                    }} sx={{ ml: "auto" }} variant="standard" placeholder={envi.value} value={config[`environment.${envi.key}`]} />
                                </Grid>
                            </>
                        )
                    }) : ""
                    : ""}

                <>
                    <Divider sx={{ mb: 1, mt: 1 }} />
                    <Typography sx={{ mb: 1 }} fontWeight={500} align="center" variant="h6" fontFamily="Poppins">Configuration</Typography>
                    <Grid container>
                        <Typography variant="h6" fontFamily="Poppins">Startup Command</Typography>
                        <TextField sx={{ ml: "auto" }} variant="standard" placeholder={imageData.imageDat.properties["startup"] ? imageData.imageDat.properties["startup"] : "Startup Command"} onChange={(e) => {
                            setConfig({ ...config, "user.startup": e.target.value ? e.target.value : "" })
                        }} value={config["user.startup"]} />
                    </Grid>
                </>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setPage("resources")} variant="contained" color="success">Continue</Button>
            </DialogActions>
        </Dialog>
    )
}