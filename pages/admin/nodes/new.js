import { Typography, Stepper, Step, StepLabel, Button, Box, Container, Grid, Paper, Divider, FormControl, TextField, Switch } from "@mui/material";
import { useState, Fragment } from "react";
import Navigation from "../../../components/admin/Navigation";
import InstallHyeLava from "../../../components/admin/nodes/new/InstallHyeLava";
import SetupNode from "../../../components/admin/nodes/new/SetupNode";
import axios from "axios";

export default function NewNode() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [hostname, setHostname] = useState("");
  const [port, setPort] = useState("");
  const [ssl, setSSL] = useState(true);
  const [cpu, setCPU] = useState("");
  const [memory, setMemory] = useState("");
  const [disk, setDisk] = useState("");
  const [nodeKey, setNodeKey] = useState(null);
  const [nodeID, setNodeID] = useState(null);
  const [panelURL, setPanelURL] = useState(null);
  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep + 1 == 2) {
      var data = await axios.post("/api/v1/admin/nodes", {
        name: name,
        address: {
          hostname: hostname,
          port: parseInt(port),
          ssl: ssl
        },
        limits: {
          cpu: parseInt(cpu),
          memory: memory,
          disk: disk
        }
      })
      setNodeKey(data.data.data.access_token);
      setNodeID(data.data.data.id);
      setPanelURL(data.data.data.panel_url);
    }
    if (activeStep + 1 == steps.length) {
      window.location.href == "/admin/nodes";
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
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
  const steps = ["Install Hye Lava", "Configure Node", "Setup"]
  return (
    <>
      <Typography variant="h4">Create New Node</Typography>
      <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
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
              <InstallHyeLava />
              : activeStep === 1 ?
                <>
                  <Grid container direction="row">
                    <Paper sx={{ mt: 1, width: "100%" }}>
                      <Typography variant="h6" sx={{ ml: 2, mt: 2, mb: 1 }}>Identification</Typography>
                      <Divider />
                      <Grid sx={{ p: 2 }} item container md={12} xs={12} lg={12} direction="column">
                        <FormControl sx={{ m: 2 }} variant="outlined">
                          <Grid container direction="row">
                            <Box sx={{ mr: 3, mb: 2 }}>
                              <Typography fontWeight="bold">Name</Typography>
                              <TextField onChange={(e) => {
                                e.preventDefault();
                                setName(e.target.value);
                              }} placeholder="Name" variant="outlined" />
                            </Box>
                            <Box sx={{ mr: 3 }}>
                              <Typography fontWeight="bold">Group (Coming Soon)</Typography>
                              <TextField onChange={(e) => {
                                e.preventDefault();
                                setGroup(e.target.value);
                              }} variant="outlined" placeholder="Group" />
                            </Box>
                          </Grid>
                        </FormControl>
                      </Grid>
                      <Typography variant="h6" sx={{ ml: 2, mb: 1 }}>Connectivity</Typography>
                      <Divider />

                      <Grid sx={{ p: 2 }} item container md={12} xs={12} lg={12} direction="column">
                        <FormControl sx={{ m: 2 }} variant="outlined">
                          <Grid container direction="row">
                            <Box sx={{ mr: 3, mb: 2 }}>
                              <Typography fontWeight="bold">Hostname</Typography>
                              <TextField placeholder="examplenode.hye.gg" variant="outlined" onChange={(e) => {
                                e.preventDefault();
                                setHostname(e.target.value);
                              }} />
                            </Box>
                            <Box sx={{ mr: 3, mb: 2 }}>
                              <Typography fontWeight="bold">Port</Typography>
                              <TextField placeholder="3535" variant="outlined" onChange={(e) => {
                                e.preventDefault();
                                setPort(e.target.value);
                              }} />
                            </Box>
                            <Box sx={{ mr: 3 }}>
                              <Typography fontWeight="bold">SSL</Typography>
                              <Switch checked={ssl} onChange={(e) => {
                                setSSL(e.target.checked);
                              }}></Switch>
                            </Box>
                          </Grid>
                        </FormControl>
                      </Grid>
                      <Typography variant="h6" sx={{ ml: 2, mb: 1 }}>Configuration</Typography>
                      <Divider />
                      <Grid sx={{ p: 2 }} item container md={12} xs={12} lg={12} direction="column">
                        <FormControl sx={{ m: 2 }} variant="outlined">
                          <Grid container direction="row">
                            <Box sx={{ mr: 3, mb: 2 }}>
                              <Typography fontWeight="bold">CPU</Typography>
                              <TextField placeholder="4" variant="outlined" onChange={(e) => {
                                setCPU(e.target.value);
                              }} />
                            </Box>
                            <Box sx={{ mr: 3, mb: 2 }}>
                              <Typography fontWeight="bold">Memory</Typography>
                              <TextField placeholder="4GB" variant="outlined" onChange={(e) => {
                                setMemory(e.target.value);
                              }} />
                            </Box>
                            <Box sx={{ mr: 3, mb: 2 }}>
                              <Typography fontWeight="bold">Disk</Typography>
                              <TextField placeholder="5000" variant="outlined" onChange={(e) => {
                                setDisk(e.target.value);
                              }} />
                            </Box>
                          </Grid>
                        </FormControl>
                      </Grid>
                    </Paper>
                  </Grid>
                </> :
                <SetupNode nodeKey={nodeKey} nodeID={nodeID} panelURL={panelURL} />}
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

NewNode.getLayout = function getLayout(page) {
  return (
    <Navigation page="nodes">
      {page}
    </Navigation>
  )
}
