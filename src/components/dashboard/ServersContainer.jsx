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
  Button
} from '@material-ui/core'
import {
    Storage as StorageIcon,
    AccountCircle as AccountIcon,
    SupervisorAccount as AdminIcon,
    Menu as MenuIcon,
    Logout as LogoutIcon
} from '@material-ui/icons'
import InboxIcon from '@material-ui/icons/Inbox'
import MailIcon from '@material-ui/icons/Mail'
import jsonwebtoken from 'jsonwebtoken'
import React from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import {
  Link
} from 'react-router-dom'
import Dashboard from '../Dashboard'
const drawerWidth = 240;
function ServersContainer() {

  return (
    <Dashboard page="servers">
         <Typography fontWeight={500} variant="h4" component="h4">
          Your Servers
        </Typography>
    </Dashboard>
  )
}

export default ServersContainer