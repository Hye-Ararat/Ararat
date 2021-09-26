import {
    Box,
    Drawer,
    AppBar,
    CssBaseline,
    Toolbar,
    Divider,
    List,
    Typography,
    ListItem,
    ListItemIcon,
    ListItemText,
    Hidden,
    BottomNavigation,
    BottomNavigationAction,
    IconButton,
    Modal,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Chip,
    Fade,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Grid,
    Backdrop,
    Avatar,
    Skeleton
  } from '@material-ui/core'
  import BackdropFilter from 'react-backdrop-filter'
  //import {ReactComponent as Logo} from '../../minecraft.svg'
  import {
      Storage as StorageIcon,
      AccountCircle as AccountIcon,
      SupervisorAccount as AdminIcon,
      Menu as MenuIcon,
      Logout as LogoutIcon,
      CheckCircleOutline as StatusIcon,
      PeopleAlt as PlayersIcon,
      SettingsEthernet as AddressIcon,
      DeveloperBoard as CpuIcon,
      Memory as MemoryIcon
  } from '@material-ui/icons'
  import InboxIcon from '@material-ui/icons/Inbox'
  import MailIcon from '@material-ui/icons/Mail'
  import jsonwebtoken from 'jsonwebtoken'
  import React from 'react'
  import Cookies from 'js-cookie'
  import axios from 'axios'
  import { shadows } from '@mui/system';
  import {
    Link,
    useParams
  } from 'react-router-dom'
  import Dashboard from '../Dashboard'
  import {getFirestore, collection, query, orderBy, getDocs, onSnapshot, doc, getDoc} from '@firebase/firestore'
  import { getAuth } from '@firebase/auth'
  import Firebase from '../db'
  import { blue } from '@material-ui/core/colors'
  import prettyBytes from 'pretty-bytes'
function Server(props){
  const database = getFirestore()
  const [allocation_data, setAllocationData] = React.useState()
  const [server_status, setServerStatus] = React.useState({
    status: null,
    cpu: null,
    memory: null,
    disk: null,
    netin: null,
    netout: null
  })
  const [node_info, setNodeInfo] = React.useState({
    address: {
      hostname: null,
      port: null
    }
  })
  React.useEffect(() => {
    if(props.server.allocations.main){
      console.log(props.server.node)
      console.log(props.instance)
      console.log(props.server.allocations.main)
      const docRef = doc(database, "instances", props.instance, "nodes", props.server.node, "allocations", props.server.allocations.main)
      onSnapshot(docRef, (doc) => {
        if (doc.exists()){
          console.log(doc.data())
          setAllocationData(doc.data())
        } else {
          console.log('nope')
        }
      })
    }
  }, [])

  React.useEffect(() => {
    const docRef = doc(database, "instances", props.instance, "nodes", props.server.node)
    async function websocketStuff(){
      const node = await getDoc(docRef)
      const node_data = node.data()
      setNodeInfo(node_data)
      const ws = new WebSocket(`wss://${node_data.address.hostname}:${node_data.address.port}/api/v1/server/${props.server.id}/resources`);
      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        setServerStatus(response)
      }
    }

    websocketStuff()
  }, [])
    return(
        <Grid item>
            <Fade in={true}>
              <Card sx={{width: 450}}>
                <CardActionArea component={Link} to={`/instance/${props.instance}/server/${props.server.id}`}>
                  <CardContent style={{padding: '0px', background: 'url(https://wallpaperaccess.com/download/minecraft-171177)', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)', backgroundRepeat: 'no-repeat'}}>
                    <BackdropFilter
                    filter={'blur(7px) brightness(50%)'}
                    >
                      <div                     style={{padding: '16px'}}>
                      <Grid container justifyContent="center">
                      <img height="45px" style={{marginBottom: 3}}src={node_info.address.hostname != null ? `https://${node_info.address.hostname}:${node_info.address.port}/api/v1/server/${props.server.id}/files/download?path=/server-icon.png`: ""} />
                      </Grid>
                        <Grid container justifyContent="center">
                   <Typography style={{backdropFilter: 'blur(5px)' }}align="center" variant="h4">{props.server.name}</Typography>
                   </Grid>
                   <Typography align="center" m={1}>
                    {server_status.status ? server_status.status == "running" ?
                   <Chip style={{margin: 'auto', verticalAlign: 'middle'}} color="success" size="large" label="Online" />
                      : "" : <Skeleton style={{margin: 'auto', verticleAlign: 'middle'}}>                   <Chip style={{margin: 'auto', verticalAlign: 'middle'}} color="success" size="large" label="Online" />
</Skeleton>                    }
                   </Typography>
                   <Grid container direction="row" justifyContent="center">
                  <Grid container justifyContent="center" direction="column" sx={{border: '1px', borderRadius: 1, width: 190, height: 100, boxShadow: 3, mt: 'auto', mr: 'auto', ml: 'auto'}} style={{backgroundColor: 'rgba(25, 25, 25, 0.7)'}}>
                    <Avatar sx={{color: '#fff', bgcolor: '#2a6abf', mt: 1}}  style={{alignSelf: 'center'}}>
                    <AddressIcon />
                    </Avatar>
                    <Chip sx={{mb: 'auto', mr: 'auto', ml: 'auto', mt: 'auto'}} color="info" size="large" label={allocation_data ? allocation_data.ip_alias + ":" + allocation_data.port : "1.1.1.1"} />
                    </Grid>
                    
                  <Grid container justifyContent="center" direction="column" sx={{border: '1px', borderRadius: 1, width: 190, height: 100, boxShadow: 3, mt: 'auto', mr: 'auto', ml: 'auto'}} style={{backgroundColor: 'rgba(25, 25, 25, 0.7)'}}>
                    <Avatar sx={{color: '#fff', bgcolor: '#2a6abf', mt: 1}}  style={{alignSelf: 'center'}}>
                    <PlayersIcon />
                    </Avatar>
                    <Fade in={props.serverThing ? true : false}>
                    <Chip sx={{mb: 'auto', mr: 'auto', ml: 'auto', mt: 'auto'}} color="info" size="large" label={props.serverThing} />
                    </Fade>
                    </Grid>
                    
                    </Grid>
                    
                   <Typography align="center" m={1}>
                   </Typography>
                   </div>
                   <CardContent>
                   <Grid container direction="column" >
                   <Typography noWrap variant="body2" style={{fontWeight: 'bold', margin: 'auto'}}>CPU Usage: {server_status.cpu ? server_status.cpu.toFixed(2) + "%" : ""}</Typography>
                     <Typography noWrap variant="body2" style={{fontWeight: 'bold', margin: 'auto'}}>Memory: {server_status.memory ? prettyBytes(server_status.memory, {binary: true}) + "/ 8GiB" : ""}</Typography>
                     <Typography noWrap variant="body2" style={{fontWeight: 'bold', margin: 'auto'}}>Disk: 22.5GB/32.0GB</Typography>
                    </Grid>
                  </CardContent>
                   </BackdropFilter>
                  </CardContent>
                  </CardActionArea>
              </Card>
{/*             <TableRow align="left" key={server.name}>
{/*               <TableCell width={10} underline="none" component="th" to="nice" scope="row">

                </TableCell> */}
                {/* <TableCell align="left">
                <Link style={{textDecoration: 'none', color: blue[500], verticalAlign: 'middle'}} to="/nice">Server Name</Link>

                </TableCell>
              <TableCell align="left">1.1.1.1</TableCell>
              <TableCell align="right">{server.limits.memory}</TableCell>
              <TableCell align="right">{server.limits.cpu}</TableCell>
              <TableCell align="right" >{server.limits.disk}</TableCell>
              <TableCell align="right" sx={{color: '#4caf50'}} ><Chip color="success" size="small" label="Online"></Chip></TableCell>
              <TableCell align="right"><Button size="small" variant="contained">Manage</Button></TableCell>
            </TableRow> */}
              </Fade>
              </Grid>
          )
}

export default Server