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
  Fade
} from '@material-ui/core'
//import {ReactComponent as Logo} from '../../minecraft.svg'
import {
    Storage as StorageIcon,
    AccountCircle as AccountIcon,
    SupervisorAccount as AdminIcon,
    Menu as MenuIcon,
    Logout as LogoutIcon,
    CheckCircleOutline as StatusIcon
} from '@material-ui/icons'
import InboxIcon from '@material-ui/icons/Inbox'
import MailIcon from '@material-ui/icons/Mail'
import jsonwebtoken from 'jsonwebtoken'
import React from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import {
  Link,
  useParams
} from 'react-router-dom'
import Dashboard from '../Dashboard'
import {getFirestore, collection, query, orderBy, getDocs, onSnapshot} from '@firebase/firestore'
import { getAuth } from '@firebase/auth'
import Firebase from '../db'
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
        setServers(current_servers)
        console.log(current_servers)
      }
      querySnapshot.forEach((doc) => {
        current_servers.push(doc.data())
        setServerData()
      })
    })
  }, [instance])
  return (
    <React.Fragment>
         <Typography fontWeight={500} variant="h4" component="h4">
          Your Servers
        </Typography>
        <TableContainer sx={{mt: 3}} component={Paper}>
        <Table>
        {servers.map((server) => {
          return(
            <Fade in={true}>
            <TableRow key={server.name}>
              <TableCell width={10} underline="none" component="th" to="nice" scope="row">

                <img style={{fill: '#fff'}} src="https://cdn.discordapp.com/attachments/802779455831146496/886843737119023135/minecraft.svg" width={50} />
                </TableCell>
                <TableCell align="left">
                <Link style={{textDecoration: 'none', color: '#90caf9', verticalAlign: 'middle'}} to="/nice">{server.name}</Link>

                </TableCell>
              <TableCell>1.1.1.1</TableCell>
              <TableCell align="right">{server.limits.memory}</TableCell>
              <TableCell align="right">{server.limits.cpu}</TableCell>
              <TableCell align="right" >{server.limits.disk}</TableCell>
              <TableCell align="right" sx={{color: '#4caf50'}} ><Chip color="success" size="small" label="Online"></Chip></TableCell>
              <TableCell align="right"><Button variant="contained">Manage</Button></TableCell>
            </TableRow>
            </Fade>
          )
        })}
        </Table>
        </TableContainer>
        </React.Fragment>
        
  )
}

export default ServersContainer