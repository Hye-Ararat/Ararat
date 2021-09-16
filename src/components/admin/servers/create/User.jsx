import React from "react"

import {
    Autocomplete,
    TextField,
    Grid,
    Typography,
    FormControlLabel,
    Checkbox,
    Box,
    Button
} from '@material-ui/core'

function User(props) {
    return (
        <React.Fragment>
        <Grid container direction="row">
                <Box sx={{ m: 2 }}>
            <Typography variant="subtitle1" component="p" fontWeight={500}>User</Typography>
        
                <Autocomplete onChange={(props.handleCompleteChange)} id="owner" sx={{ width: 300 }} getOptionLabel={(option) => option.name + ` (${option.email})`}
                    freeSolo options={props.users} renderInput={(params) => <TextField  {...params} />}></Autocomplete>
            </Box>
            <Grid sx={{ m: 2 }}>
                <Typography variant="subtitle1" component="p" fontWeight={500}>Permissions</Typography>
                <Grid sx={{ m: 1 }}>
                    <FormControlLabel control={<Checkbox checked={false}></Checkbox>} label="All Permissions" />

                </Grid>
                <Grid sx={{ m: 1 }}>
                    <Typography variant="subtitle1" component="p" fontWeight={500}>Files</Typography>
                    <FormControlLabel control={<Checkbox checked={true}></Checkbox>} label="Read Files" />
                    <FormControlLabel control={<Checkbox checked={true}></Checkbox>} label="Write Files" />
                </Grid>
            </Grid>
        </Grid >
                    </React.Fragment>
)
}

export default User