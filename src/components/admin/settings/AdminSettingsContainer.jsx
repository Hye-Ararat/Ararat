import AdminDashboard from "../AdminDashboard"
import {
    Typography,
    Paper,
    TextField,
    Box,
    Grid,
    Select,
    MenuItem,
    Switch,
    FormGroup,
    FormControlLabel
} from '@material-ui/core'
import {
    LoadingButton
} from '@material-ui/lab'
import React from 'react'
function AdminSettingsContainer() {
    const [settings, setSettings] = React.useState({
        panel: {
        company_name: null,
        two_factor: {
            administrator: null,
            user: null
        }
    },
    mail: {
        server: null,
        port: null,
        encryption: null,
        username: null,
        password: null,
        from_address: null,
        from_name: null
    }
    })
    return (
        <React.Fragment>
            <Typography fontWeight={500} variant="h4" component="h4">
                Settings
            </Typography>
            <FormGroup>
            <Typography mt={2} mb={1} variant="h6" component="h6">Panel Options</Typography>
            <Paper variant="outlined">
                <Grid container direction="row">
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Company Name</Typography>
                        <TextField placeholder="Hye Hosting LLC."></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Require 2-Factor Authentication</Typography>
                        <Box>
                        <FormControlLabel control={                        <Switch
                        checked={false}
                        onChange={() => alert("This Feature Is Not Implemented Yet!")}
                        name="Adminstrators"
                        />} label="Administrators" />
                        </Box>
                        <Box>
                                                <FormControlLabel control={                        <Switch
                        checked={false}
                        onChange={() => alert("This Feature Is Not Implemented Yet!")}
                        name="Users"
                        />} label="Users" />
                        </Box>

                    </Box>
                </Grid>
            </Paper>
            <Typography mt={2} mb={1} variant="h6" component="h6">Mail Settings</Typography>
            <Paper variant="outlined">
                <Grid container direction="row">
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>SMTP Server</Typography>
                        <TextField placeholder="smtp.example.com"></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>SMTP Port</Typography>
                        <TextField placeholder="587"></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Encryption</Typography>
                        <Select value={'TLS'}>
                            <MenuItem value={'none'}>None</MenuItem>
                            <MenuItem value={'TLS'}>Transport Layer Security (TLS)</MenuItem>
                            <MenuItem value={'SSL'}>Secure Socket Layer (SSL)</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Grid container direction="row">
                        <Typography fontStyle="regular" variant="subtitle1" component="p" fontWeight={500}>Username</Typography>
                        <Typography ml={1} fontStyle="italic" variant="overline" component="p">Optional</Typography>
                        </Grid>
                        <TextField></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Grid container direction="row">
                        <Typography fontStyle="regular" variant="subtitle1" component="p" fontWeight={500}>Password</Typography>
                        <Typography ml={1} fontStyle="italic" variant="overline" component="p">Optional</Typography>
                        </Grid>
                        <TextField></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>From Address</Typography>
                        <TextField placeholder="no-reply@hye.gg"></TextField>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>From Name</Typography>
                        <TextField placeholder="Ararat by Hye"></TextField>
                    </Box>
                </Grid>
            </Paper>
            <LoadingButton loading variant="outlined">
                Save
            </LoadingButton>
            </FormGroup>
        </React.Fragment>
    )
}
export default AdminSettingsContainer