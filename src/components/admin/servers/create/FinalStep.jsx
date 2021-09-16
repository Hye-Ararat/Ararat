import React from 'react'
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
    FormControlLabel,
    Autocomplete,
    Checkbox,
    Button,
    Divider,
    Fade
} from '@material-ui/core'
import {
    LoadingButton
} from '@material-ui/lab'
import axios from 'axios'
import https from 'https'
import User from './User'
function FinalStep(Data){
    console.log(Data.Data)
    const magma_cube = Data.Data.magmacube
    const [user_count, setUserCount] = React.useState(1)
    const [server, setServer] = React.useState({
        type: magma_cube.type,
        magma_cube: magma_cube._id,
        name: null,
        owner: null,
        image: null,
        network: {
            type: null,
            configuration: null
        },
        limits: {
            cpu: null,
            memory: null,
            disk: null
        }
    })
    React.useEffect(() => {
        if (Data.Data.type == "Docker"){
            let server_data = server
            server_data.image = Data.Data.image.image
            setServer(server_data)
        }
    }, [])
    const [creatingServer, setCreatingServer] = React.useState(false)
    const users = [
        {name: 'Joseph Maldjian', email: 'javmaldjian@gmail.com', id: 1},
        {name: 'Wolfo Gaming', email: 'klokko06@gmail.com', id: 1}
    ]
    const nodes = [
        {name: 'NL-01', group: 'Netherlands', id: 1}
    ]
    const port_binds = [
        {address: '0.0.0.0', alias: 'aliashere.com', port: 25565, id: 1}
    ]
    function CreateServer(){
        setCreatingServer(true)
        console.log(server)
        axios.get('http://api.hye.gg:3000/api/v1/admin/magma_cubes').then(function(response){
            setCreatingServer(false)
            const instance = axios.create({
                httpsAgent: new https.Agent({  
                  rejectUnauthorized: false
                })
              });
        instance.post('https://test-ararat.hyehosting.com:2221').then(function(response){
            console.log(response.data)
        })
        }).catch(function(error){
            setCreatingServer(false)
        })
    }
    function handleFieldChange(event){
        if (event.target.id.includes('.')){
            if (event.target.id.includes('limits')){
                if (event.target.id.includes('cpu')){
                    let server_data = server
                    var cpu = parseInt(event.target.value)
                    server_data.limits.cpu = cpu
                    setServer(server_data)
                }
                if (event.target.id.includes('memory')){
                    let server_data = server
                    var memory = parseInt(event.target.value)
                    server_data.limits.memory = memory
                    setServer(server_data)
                }
                if (event.target.id.includes('disk')){
                    let server_data = server
                    var disk = parseInt(event.target.value)
                    server_data.limits.disk = disk
                    setServer(server_data)
                }
            }
        } else {
            let server_data = server
            server_data[event.target.id] = event.target.value
            setServer(server_data)
        }
    }
    function handleCompleteChange(event, value){
        if (event.target.id == "owner-option-0"){
            let server_data = server
            server_data.owner = value.id
            setServer(server_data)
        }
        if (event.target.id == "node-option-0"){
            let server_data = server
            server_data.node = value.id
            setServer(server_data)
        }
        if (event.target.id == "port-bind-option-0"){
            let server_data = server
            server_data.network.configuration = value.id
            setServer(server_data)
        }
    }
    const [user_elements, setUserElements] = React.useState()
    React.useEffect(() => {
        let elements = []
        function setUserElementFunction(){
            if (user_count == elements.length){
                console.log('yes')
                setUserElements(elements)
            } else {
                console.log('not yet')
            }
        }

        for (let number = 0; number < user_count; number++){
            elements.push(
            <React.Fragment>
            <Divider />
            <User handleCompleteChange={handleCompleteChange} users={users} />
            </React.Fragment>
            )
            setUserElementFunction()
        }
    }, [user_count])
return(
    <>
<FormGroup>
<Typography mt={2} mb={1} variant="h6" component="h6">Basic Information</Typography>
<Paper variant="outlined">
    <Grid container direction="row">
        <Box sx={{ m: 2 }}>
            <Typography variant="subtitle1" id="name" component="p" fontWeight={500}>Server Name</Typography>
            <TextField id="name" onChange={handleFieldChange} ></TextField>
        </Box>
        <Box sx={{ m: 2 }}>
            <Typography variant="subtitle1" component="p" fontWeight={500}>Node</Typography>
            <Autocomplete onChange={(handleCompleteChange)} id="node" sx={{ width: 300 }}   groupBy={(option) => option.location}   getOptionLabel={(option) => option.name}
freeSolo options={nodes} renderInput={(params) => <TextField {...params} />}></Autocomplete>
        </Box>
    </Grid>
</Paper>
<Typography mt={2} mb={1} variant="h6" component="h6">Users</Typography>
<Paper variant="outlined">
        {user_elements}
        {user_count > 1 ?<Button onClick={() => setUserCount(user_count -1)} variant="contained" color="error" size="small" sx={{m: 1}}>Remove</Button> : ""}
    <Divider />
    <Button sx={{m: 1}} variant="contained" onClick={() => setUserCount(user_count + 1)}>Add User</Button>
</Paper>
<Typography mt={2} mb={1} variant="h6" component="h6">Networking</Typography>
<Paper variant="outlined">
    <Grid container direction="row">
        {magma_cube.type == "Docker" ? 
      <Box sx={{ m: 2 }}>
      <Typography variant="subtitle1" component="p" fontWeight={500}>Port Bind</Typography>
      <Autocomplete  onChange={(handleCompleteChange)} id="port-bind" sx={{ width: 300 }}   groupBy={(option) => option.alias}   getOptionLabel={(option) => option.address + ":" + `${option.port}`}


freeSolo options={port_binds} renderInput={(params) => <TextField {...params} />}></Autocomplete>
  </Box>    :
    magma_cube.type == "N-VPS" || magma_cube.type == "KVM" ? 
    <Box sx={{ m: 2 }}>
    <Typography variant="subtitle1" component="p" fontWeight={500}>Network Type</Typography>
    <Select value={'NAT'}>
        <MenuItem value={'NAT'}>Network Address Translation (NAT)</MenuItem>
        <MenuItem value={'Dedicated IP'}>Dedicated IP</MenuItem>
    </Select>
</Box>
    : ""
    }
    </Grid>
</Paper>
<Typography mt={2} mb={1} variant="h6" component="h6">Resource Management</Typography>
<Paper variant="outlined">
    <Grid container direction="row">
        <Box sx={{ m: 2 }}>
            <Typography  variant="subtitle1" component="p" fontWeight={500}>CPU</Typography>
            <TextField id="limits.cpu" onChange={handleFieldChange}></TextField>
        </Box>
        <Box sx={{ m: 2 }}>
            <Typography variant="subtitle1" component="p" fontWeight={500}>Memory</Typography>
            <TextField id="limits.memory" onChange={handleFieldChange} ></TextField>
        </Box>
        <Box sx={{ m: 2 }}>
            <Typography  variant="subtitle1" component="p" fontWeight={500}>Storage</Typography>
            <TextField id="limits.disk" onChange={handleFieldChange}></TextField>
        </Box>
    </Grid>
</Paper>
<LoadingButton onClick={CreateServer} loading={creatingServer} variant="outlined">
    Save
</LoadingButton>
</FormGroup>
</>)
}

export default FinalStep