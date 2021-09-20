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
import Server from './Server'

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
    axios.get('https://api.mcsrvstat.us/2/grmpixelmon.com').then(function(response){
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
            <Server instance={instance} server={server} serverThing={serverThing}/>
          )
          })}
          </Grid>
        </React.Fragment>
        
  )
}

export default ServersContainer