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
  Avatar
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
import {getFirestore, collection, query, orderBy, getDocs, onSnapshot} from '@firebase/firestore'
import { getAuth } from '@firebase/auth'
import Firebase from '../db'
import { blue } from '@material-ui/core/colors'

const drawerWidth = 240;
const database = getFirestore()
const auth = getAuth(Firebase)
function ServersContainer() {
  const {instance} = useParams()
  const [servers, setServers] = React.useState([])

  React.useEffect(() => {
    setServers([])
    const serversRef = collection(database, `/instances/${instance}/servers`)
    const q = query(serversRef, orderBy(`users.${auth.currentUser.uid}`))
    onSnapshot(q, (querySnapshot) => {
      console.log('fetched')
      let current_servers = []
      function setServerData(){
        if (querySnapshot.docs.length == current_servers.length){
          setServers(current_servers)
          console.log(current_servers)
        } else {
          console.log('not enough yet')
        }

      }
      querySnapshot.forEach((doc) => {
        var current_server = doc.data()
        current_server.id = doc.id

        current_servers.push(current_server)
        setServerData()
      })
    })
  }, [instance])
  const [serverThing, setServerThing] = React.useState()
  React.useEffect(() => {
    axios.get('https://api.mcsrvstat.us/2/mc.hypixel.net').then(function(response){
      setServerThing(response.data.players.online + '/' + response.data.players.max)
    })
  }, [])

  return (
    <React.Fragment>
         <Typography variant="h4" sx={{mb: 1}}>
          Your Servers
        </Typography>
{/*         <TableContainer sx={{mt: 3}} component={Paper}>
        <Table>
          <TableHead size="small">
          <TableCell align="left">Name</TableCell>
          <TableCell align="left">Address</TableCell>
          <TableCell align="right">Memory</TableCell>
          <TableCell align="right">CPU Cores</TableCell>
          <TableCell align="right">Disk</TableCell>
          <TableCell align="right">Status</TableCell>
          <TableCell align="right">Action</TableCell>


          </TableHead> */}
          <Grid spacing={5} container direction="row">
        {servers.map((server) => {
          console.log(server.name)
          return(
            <Grid item>
            <Fade in={true}>
              <Card sx={{width: 400}}>
                <CardActionArea component={Link} to={`/instance/${instance}/server/${server.id}`}>
                  <CardContent style={{padding: '0px', background: 'url(https://wallpaperaccess.com/download/minecraft-171177)', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)', backgroundRepeat: 'no-repeat'}}>
                    <BackdropFilter
                    filter={'blur(7px) brightness(50%)'}
                    >
                      <div                     style={{padding: '16px'}}>
                      <Grid container justifyContent="center">
                      <img height="45px" style={{marginBottom: 3}}src="https://mc-api.net/v3/server/favicon/mc.hypixel.net" />
                      </Grid>
                        <Grid container justifyContent="center">
                   <Typography style={{backdropFilter: 'blur(5px)' }}align="center" variant="h4">{server.name}</Typography>
                   </Grid>
                   <Typography align="center" m={1}>
                   <Chip style={{margin: 'auto', verticalAlign: 'middle'}} color="success" size="large" label="Online" />
                   </Typography>
                   <Grid container direction="row" justifyContent="center">
                  <Grid container justifyContent="center" direction="column" sx={{border: '1px', borderRadius: 1, width: 130, height: 100, boxShadow: 3, mt: 'auto', mr: 'auto', ml: 'auto'}} style={{backgroundColor: 'rgba(25, 25, 25, 0.7)'}}>
                    <Avatar sx={{color: '#fff', bgcolor: '#2a6abf', mt: 1}}  style={{alignSelf: 'center'}}>
                    <AddressIcon />
                    </Avatar>
                    <Chip sx={{mb: 'auto', mr: 'auto', ml: 'auto', mt: 'auto'}} color="info" size="large" label="1.1.1.1" />
                    </Grid>
                    
                  <Grid container justifyContent="center" direction="column" sx={{border: '1px', borderRadius: 1, width: 130, height: 100, boxShadow: 3, mt: 'auto', mr: 'auto', ml: 'auto'}} style={{backgroundColor: 'rgba(25, 25, 25, 0.7)'}}>
                    <Avatar sx={{color: '#fff', bgcolor: '#2a6abf', mt: 1}}  style={{alignSelf: 'center'}}>
                    <PlayersIcon />
                    </Avatar>
                    <Fade in={serverThing ? true : false}>
                    <Chip sx={{mb: 'auto', mr: 'auto', ml: 'auto', mt: 'auto'}} color="info" size="large" label={serverThing} />
                    </Fade>
                    </Grid>
                    
                    </Grid>
                    
                   <Typography align="center" m={1}>
                   </Typography>
                   </div>
                   <CardContent>
                   <Grid container direction="column" >
                   <Typography variant="body2" style={{fontWeight: 'bold', margin: 'auto'}}>CPU Usage: 22%</Typography>
                     <Typography variant="body2" style={{fontWeight: 'bold', margin: 'auto'}}>Memory: 2.01GB/5.0GB</Typography>
                     <Typography variant="body2" style={{fontWeight: 'bold', margin: 'auto'}}>Disk: 22.5GB/32.0GB</Typography>
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
        })}
        </Grid>
        {/* </Table> */}
        {/* </TableContainer> */}
        </React.Fragment>
        
  )
}

export default ServersContainer