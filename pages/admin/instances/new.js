import Navigation from "../../../components/admin/Navigation"
import { Box, Divider, FormControl, Grid, Paper, Stepper, TextField, Typography, Step, StepLabel, Container, Button, Card, CardContent, CardActionArea, Switch, Modal, Select, MenuItem } from "@mui/material"
import { useState, Fragment } from "react"
import { convertNetworkID } from "../../../util/converter"

export async function getServerSideProps({ req, res }) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }

    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

    var { connectToDatabase } = require("../../../util/mongodb")
    var { db } = await connectToDatabase()
    var { verify, decode } = require("jsonwebtoken")
    var { ObjectId } = require("mongodb")

    try {
        var valid_session = verify(req.cookies.access_token, process.env.ENC_KEY);
    } catch {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false
            }
        }
    }
    if (!valid_session) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false
            }
        }
    }

    var user_data = decode(req.cookies.access_token);
    console.log(user_data);
    if (user_data.admin && user_data.admin.instances && user_data.admin.instances.write) {
        var magma_cubes = await db.collection("magma_cubes").find({}).toArray();
        console.log(magma_cubes);
        var networks = await db.collection("networks").find({}).toArray();
    }
    return {
        props: {
            magma_cubes: magma_cubes ? JSON.parse(JSON.stringify(magma_cubes)) : JSON.parse(JSON.stringify([])),
            networks: networks ? JSON.parse(JSON.stringify(networks)) : JSON.parse(JSON.stringify([])),
            user: JSON.parse(JSON.stringify(user_data))
        }
    }
}

export default function NewInstance({ magma_cubes, user, networks }) {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [addDiskOpen, setAddDiskOpen] = useState(false);
    const [attachNetworkOpen, setAttachNetworkOpen] = useState(false);
    const [selectedDeviceType, setSelectedDeviceType] = useState("nic");
    const [storagePool, setStoragePool] = useState("default");
    const [cube, setCube] = useState(null);
    const [type, setType] = useState(null);
    const [image, setImage] = useState(null);
    const [cpu, setCPU] = useState(null);
    const [cpuPriority, setCPUPriority] = useState("10");
    const [memory, setMemory] = useState(null);
    const [diskPriority, setDiskPriority] = useState("5");
    const [enforceMemoryLimit, setEnforceMemoryLimit] = useState(true);
    const [devices, setDevices] = useState({
        root: {
            type: "disk",
            path: "/",
            pool: "default",
        }
    });
    const [storageName, setStorageName] = useState("root");
    const [networkID, setNetworkID] = useState(null);
    const [storageSize, setStorageSize] = useState(null);
    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };
    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        if (activeStep - 1 == 0) {
            setCube(null);
            setType(null);
            setImage(null);
        }
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };
    const handleReset = () => {
        setActiveStep(0);
    };
    const steps = ["Image Data", "Device Configuration", "User Configuration"]

    return (
        <>
            <Typography variant="h4" sx={{ mb: 1 }}>Create Instance</Typography>
            <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 3 }}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </Fragment>
            ) : (
                <Fragment>
                    <Container>
                        {activeStep === 0 ?
                            <>
                                {!cube ?
                                    <>
                                        <Typography variant="h6" sx={{ mt: 1 }}>Select Magma Cube</Typography>
                                        <Grid direction="row" container>
                                            {magma_cubes.map((cube) => {
                                                return (
                                                    <Card key={cube._id} sx={{ mt: 1, width: "20%", mr: 2 }}>
                                                        <CardActionArea onClick={() => {
                                                            if (cube.types.length == 1) {
                                                                setType(cube.types[0]);
                                                            }
                                                            if (Object.keys(cube.images).length <= 1) {
                                                                setImage(Object.keys(cube.images)[0]);
                                                            }
                                                            if (cube.types.length == 1 && Object.keys(cube.images).length <= 1) {
                                                                setActiveStep(activeStep + 1)
                                                            }
                                                            setCube(cube);
                                                        }}>
                                                            <CardContent>
                                                                <Typography variant="h6">{cube.name}</Typography>
                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>

                                                )
                                            })}
                                        </Grid>
                                    </>
                                    : cube && !type ?
                                        <>
                                            <Typography variant="h6" sx={{ mt: 1 }}>Select Type</Typography>
                                            <Grid direction="row" container>
                                                <Card sx={{ mt: 1, width: "20%", mr: 2 }}>
                                                    <CardActionArea onClick={() => {
                                                        setType("kvm");
                                                        if (image){
                                                            handleNext();
                                                        }
                                                    }}>
                                                        <CardContent>
                                                            <Typography variant="h6">KVM</Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                                <Card sx={{ mt: 1, width: "20%", mr: 2 }}>
                                                    <CardActionArea onClick={() => {
                                                        setType("n-vps");
                                                        if (image) {
                                                            handleNext();
                                                        }
                                                    }}>
                                                        <CardContent>
                                                            <Typography variant="h6">N-VPS</Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        </>
                                        : type && !image ? 
                                        <>
                                        <Typography variant="h6" sx={{ mt: 1 }}>Select Image</Typography>
                                        <Grid direction="row" container>
                                            {Object.keys(cube.images).map((image) => {
                                                return (
                                                    <Card key={image} sx={{ mt: 1, width: "20%", mr: 2 }}>
                                                        <CardActionArea onClick={() => {
                                                            setImage(image);
                                                            handleNext();
                                                        }}>
                                                            <CardContent>
                                                                <Typography variant="h6">{image}</Typography>
                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                )
                                            })}
                                        </Grid>
                                        </>
                                        : ""}
                            </>
                            : activeStep === 1 ?
                                <>
                                    <Grid container direction="row">
                                        <Paper sx={{ mt: 1, width: "100%" }}>
                                            <Typography variant="h6" sx={{ ml: 2, mt: 2, mb: 1 }}>Resource Limits</Typography>
                                            <Divider />
                                            <Grid sx={{ p: 2 }} item container md={12} xs={12} direction="column">
                                                <FormControl sx={{ m: 2 }} variant="outlined">
                                                    <Grid container direction="row">
                                                        <Box sx={{ mr: 3, mb: 2 }}>
                                                            <Typography fontWeight="bold">CPU</Typography>
                                                            <TextField onChangeCapture={(e) => {
                                                                e.preventDefault();
                                                                setCPU(e.target.value);
                                                            }} variant="outlined" placeholder="4" />
                                                        </Box>
                                                        <Box sx={{ mr: 3, mb: 2 }}>
                                                            <Typography fontWeight="bold">Memory</Typography>
                                                            <TextField onChangeCapture={(e) => {
                                                                e.preventDefault();
                                                                setMemory(e.target.value);
                                                            }} variant="outlined" placeholder="1024" />
                                                        </Box>
                                                    </Grid>
                                                </FormControl>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                    <Grid container direction="row">
                                        <Paper sx={{ mt: 1, width: "100%" }}>
                                            <Typography variant="h6" sx={{ ml: 2, mt: 2, mb: 1 }}>Disks</Typography>
                                            <Divider />
                                            <Modal open={addDiskOpen} onClose={() => setAddDiskOpen(false)}>
                                                <Box sx={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    width: "50%",
                                                    bgcolor: 'background.paper',
                                                    border: '2px solid #000',
                                                    boxShadow: 24,
                                                    p: 4,
                                                }}>
                                                    <Typography variant="h6">Add Disk</Typography>
                                                    <Grid container direction="column" sx={{ p: 3 }}>
                                                        <Grid sx={{ p: 2 }} container md={12} xs={12} lg={12} direction="column">
                                                            <FormControl variant="outlined">
                                                                <Grid direction="row">
                                                                    <Box sx={{ mr: 3 }}>
                                                                        <Typography fontWeight="bold">Name</Typography>
                                                                        <TextField placeholder="root" value={storageName} onChangeCapture={(e) => setStorageName(e.target.value)}></TextField>
                                                                    </Box>
                                                                    <Box sx={{ mr: 3 }}>
                                                                        <Typography fontWeight="bold">Storage Pool</Typography>
                                                                        <TextField placeholder="default" value={storagePool} onChangeCapture={(e) => setStoragePool(e.target.value)}></TextField>
                                                                    </Box>
                                                                    <Box sx={{ mr: 3}}>
                                                                        <Typography fontWeight="bold">Storage Size</Typography>
                                                                        <TextField placeholder="30GB" value={storageSize} onChangeCapture={(e) => setStorageSize(e.target.value)}></TextField>
                                                                    </Box>
                                                                </Grid>
                                                                <Button variant="contained" color="success" sx={{ width: "30%", mt: 3 }} onClick={(e) => {
                                                                    e.preventDefault();
                                                                    var tempDevices = devices;
                                                                    tempDevices[storageName] = {
                                                                        path: "/",
                                                                        pool: storagePool,
                                                                        type: "disk",
                                                                        size: storageSize
                                                                    }
                                                                    setAddDiskOpen(false);
                                                                    setDevices(tempDevices);
                                                                    setStorageName("root");
                                                                    setStoragePool("default");
                                                                    setStorageSize(null);
                                                                    setAddDiskOpen(false);
                                                                    setDevices(tempDevices);
                                                                    console.log(devices);
                                                                }}>Add Disk</Button>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Modal>
                                            <Grid sx={{ p: 2 }} item container md={12} xs={12} direction="column">
                                                <FormControl sx={{ m: 2 }} variant="outlined">
                                                    <Grid container direction="column">
                                                    {Object.keys(devices).filter(key => devices[key].type == "disk").length <= 0 ?
                                                        <> 
                                                        <Typography fontWeight={500} sx={{m: "auto"}}>No Disks</Typography> 
                                                        <Typography fontWeight={300} sx={{m: "auto"}}>When a root disk is not added, Ararat will automatically create an unmetered disk on the default storage pool</Typography>
                                                        </>: ""}
                                                        {devices ? Object.keys(devices).filter(key => devices[key].type == "disk").map((key, index) => {
                                                            return (
                                                                <Grid key={key} container direction="row" sx={{backgroundColor: "background.default", borderRadius: 2, p: 2, mb: 1}}>
                                                                    <Box>
                                                                    <Typography variant="h6">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                                                                    {devices[key].size ? <Typography fontWeight={500}>Size: {devices[key].size}</Typography> : <Typography fontWeight={500}>Size: Unmetered</Typography>}
                                                                    {devices[key].pool ? <Typography fontWeight={500}>Storage Pool: {devices[key].pool}</Typography> : <Typography fontWeight={500}>Storage Pool: default</Typography>}
                                                                    </Box>
                                                                    <Button variant="contained" color="error" sx={{ width: "10%", ml: "auto", mt: "auto", mb: "auto" }} onClick={(e) => {
                                                                        var temporaryDevices = devices;
                                                                        delete temporaryDevices[key];
                                                                        setDevices(temporaryDevices);
                                                                        setStorageSize("30GB")
                                                                        setStorageSize("")
                                                                    }}>Remove</Button>
                                                                </Grid>
                                                            )
                                                        }) : "" }
                                                        <Button sx={{ ml: "auto", mt: 2 }} variant="contained" color="success" onClick={() => setAddDiskOpen(true)}>Add Disk</Button>
                                                    </Grid>
                                                </FormControl>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                    <Grid container direction="row">
                                        <Paper sx={{ mt: 1, width: "100%" }}>
                                            <Typography variant="h6" sx={{ ml: 2, mt: 2, mb: 1 }}>Networks</Typography>
                                            <Divider />
                                            <Modal open={attachNetworkOpen} onClose={() => setAttachNetworkOpen(false)}>
                                                <Box sx={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    width: "50%",
                                                    bgcolor: 'background.paper',
                                                    border: '2px solid #000',
                                                    boxShadow: 24,
                                                    p: 4,
                                                }}>
                                                    <Typography variant="h6">Attach Network</Typography>
                                                    <Grid container direction="column" sx={{ p: 3 }}>
                                                        <Grid sx={{ p: 2 }} container md={12} xs={12} lg={12} direction="column">
                                                            <FormControl variant="outlined">
                                                                <Grid direction="row">
                                                                    <Box sx={{ mr: 3 }}>
                                                                        <Typography fontWeight="bold">Network ID</Typography>
                                                                        <TextField placeholder="Network ID" value={networkID} onChangeCapture={(e) => setNetworkID(e.target.value)}></TextField>
                                                                    </Box>
                                                                </Grid>
                                                                 <Button variant="contained" color="success" sx={{ width: "30%", mt: 3 }} onClick={(e) => {
                                                                    e.preventDefault();
                                                                    var tempDevices = devices;
                                                                    tempDevices[convertNetworkID(networkID)] = {
                                                                        network: convertNetworkID(networkID),
                                                                        type: "nic",
                                                                    }
                                                                    setAttachNetworkOpen(false);
                                                                    setDevices(tempDevices);
                                                                    setNetworkID(null);
                                                                    console.log(devices);
                                                                }}>Attach Network</Button>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Modal>
                                            <Grid sx={{ p: 2 }} item container md={12} xs={12} direction="column">
                                                <FormControl sx={{ m: 2 }} variant="outlined">
                                                    <Grid container direction="column">
                                                        {Object.keys(devices).filter(key => devices[key].type == "nic").length <= 0 ?
                                                        <> 
                                                        <Typography fontWeight={500} sx={{m: "auto"}}>No Networks</Typography> 
                                                        <Typography fontWeight={300} sx={{m: "auto"}}>This instance will have no internet access without a network attached</Typography>
                                                        </>: ""}
                                                        {devices ? Object.keys(devices).filter(key => devices[key].type == "nic").map((key, index) => {
                                                            return (
                                                                <Grid key={key} container direction="row" sx={{backgroundColor: "background.default", borderRadius: 2, p: 2, mb: 1}}>
                                                                    <Box>
                                                                    <Typography variant="h6">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                                                                    </Box>
                                                                    <Button variant="contained" color="error" sx={{ width: "10%", ml: "auto" }} onClick={(e) => {
                                                                        var temporaryDevices = devices;
                                                                        delete temporaryDevices[key];
                                                                        setDevices(temporaryDevices);
                                                                        setNetworkID("12312312313")
                                                                        setNetworkID("")
                                                                    }}>Remove</Button>
                                                                </Grid>
                                                            )
                                                        }) : "" }
                                                        <Button sx={{ ml: "auto" }} variant="contained" color="success" onClick={() => setAttachNetworkOpen(true)}>Attach Network</Button>
                                                    </Grid>
                                                </FormControl>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                    <Grid container direction="row">
                                        <Paper sx={{ mt: 1, width: "100%" }}>
                                            <Typography variant="h6" sx={{ ml: 2, mt: 2, mb: 1 }}>Advanced</Typography>
                                            <Divider />
                                            <Grid sx={{ p: 2 }} item container md={12} xs={12} direction="column">
                                                <FormControl sx={{ m: 2 }} variant="outlined">
                                                    <Grid container direction="row">
                                                        <Box sx={{ mr: 3, mb: 2 }}>
                                                            <Typography fontWeight="bold">Disk Priority</Typography>
                                                            <TextField value={diskPriority} onChangeCapture={(e) => {
                                                                e.preventDefault();
                                                                setDiskPriority(e.target.value);
                                                            }} variant="outlined" placeholder="4" />
                                                        </Box>
                                                        {type == "n-vps" ?
                                                            <>
                                                                <Box sx={{ mr: 3, mb: 2 }}>
                                                                    <Typography fontWeight="bold">CPU Priority</Typography>
                                                                    <TextField onChangeCapture={(e) => {
                                                                        e.preventDefault();
                                                                        setCPUPriority(e.target.value);
                                                                    }} variant="outlined" value={cpuPriority} placeholder="10" />
                                                                </Box>
                                                                <Box sx={{ mr: 3, mb: 2 }}>
                                                                    <Typography fontWeight="bold">Enforce Memory Limits</Typography>
                                                                    <Switch checked={enforceMemoryLimit} onChange={(e) => {
                                                                        setEnforceMemoryLimit(e.target.checked);
                                                                    }} />
                                                                </Box>
                                                            </>

                                                            : ""}
                                                    </Grid>
                                                </FormControl>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </>
                                : <p>step 2</p>}
                    </Container>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}

                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </Fragment>
            )}
        </>
    )
}
NewInstance.getLayout = (page) => {
    return (
        <Navigation page="instances">
            {page}
        </Navigation>
    )
}