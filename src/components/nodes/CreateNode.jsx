import AdminDashboard from "../admin/AdminDashboard"
import {
    Typography,
    Stepper,
    Step,
    StepLabel,
    FormGroup,
    Grid,
    Paper,
    TextField,
    FormControlLabel,
    Box,
    Switch,
    Autocomplete,
    Button,
    InputAdornment
} from '@material-ui/core'
import React from 'react'
const nodes = [
    {group: 'Netherlands', id: 1}
]
function CreateNode(){
    const [activeStep, setActiveStep] = React.useState(0)
    return(
    <AdminDashboard page="nodes">
                    <Typography fontWeight={500} variant="h4" component="h4">
                Create Node
            </Typography>
            <Stepper sx={{mt: 2}} activeStep={activeStep}>
                <Step>
                    <StepLabel>Node Information</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Install Hye Lava</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Pair with Ararat</StepLabel>
                </Step>
            </Stepper>
            {activeStep == 0 ?
            <FormGroup>
            <Typography mt={2} mb={1} variant="h6" component="h6">Panel Information</Typography>
            <Paper variant="outlined">
                <Grid container direction="row">
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Name</Typography>
                        <TextField placeholder="US-DAL-1"></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
            <Typography variant="subtitle1" component="p" fontWeight={500}>Group</Typography>
            <Autocomplete onChange={() => alert('changed')} id="group" sx={{ width: 300 }} getOptionLabel={(option) => option.group}
freeSolo options={nodes} renderInput={(params) => <TextField  helperText="If you enter a group that does not exist, it will be created" {...params} />}></Autocomplete>
        </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Automatic Deployment</Typography>
                     <Switch
                        checked={true}
                        onChange={() => alert("This Feature Is Not Implemented Yet!")}
                        />

                    </Box>
                </Grid>
            </Paper>
            <Typography mt={2} mb={1} variant="h6" component="h6">Node Information</Typography>
            <Paper variant="outlined">
                <Grid container direction="row">
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Total Memory</Typography>
                        <TextField helperText="Leave blank for automatic detection"             InputProps={{
            endAdornment: <InputAdornment position="end">MB</InputAdornment>,
          }}
 placeholder="65536"></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Memory Overallocation</Typography>
                        <TextField helperText="Enter -1 to disable resource checking."             InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
 placeholder="65536"></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Total Disk</Typography>
                        <TextField helperText="Leave blank for automatic detection"             InputProps={{
            endAdornment: <InputAdornment position="end">MB</InputAdornment>,
          }}
 placeholder="1024000"></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Disk Overallocation</Typography>
                        <TextField helperText="Enter -1 to disable resource checking."             InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
 placeholder="65536"></TextField>
                    </Box>
                </Grid>
            </Paper>
            <Typography mt={2} mb={1} variant="h6" component="h6">Connection Information</Typography>
            <Paper variant="outlined">
                <Grid container direction="row">
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Hostname</Typography>
                        <TextField placeholder="us-dal-1.hyehosting.com"></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Port</Typography>
                        <TextField placeholder="8443"></TextField>
                    </Box>
                </Grid>
            </Paper>
            <Button onClick={() => setActiveStep(1)}>Next</Button>
            </FormGroup>
             : activeStep == 1 ?
             <>
             <p>Not yet implemented continue to next :D</p>
             <Button onClick={() => setActiveStep(2)}>Next</Button>
             </>
             : activeStep == 2 ? 
             <Stepper orientation="vertical">
                 <Step>
                     <StepLabel>Start Lava</StepLabel>
                 </Step>
                 <Step>
                     <StepLabel>Pair with Ararat</StepLabel>
                 </Step>
                 <Step>
                     <StepLabel>Success</StepLabel>
                 </Step>
             </Stepper>
             : ""}
    </AdminDashboard>
    )
}
export default CreateNode