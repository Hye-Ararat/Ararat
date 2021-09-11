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
    Fade,
    Paper,
    Grid,
    TextField,
    FormControlLabel,
    Switch,
    Chip
    } from '@material-ui/core'
  import {
      Storage as StorageIcon,
      AccountCircle as AccountIcon,
      SupervisorAccount as AdminIcon,
      Menu as MenuIcon,
      Logout as LogoutIcon,
      Check as CheckIcon
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
import {LoadingButton} from '@material-ui/lab'
import Firebase from '../db'
import {getAuth, updateProfile, updateEmail} from 'firebase/auth'
import Navigation from './Navigation'
const auth = getAuth(Firebase)

  function AccountContainerInstances() {

    const [user_data, setUserData] = React.useState({
    email: auth.currentUser.email,
    name: auth.currentUser.displayName})
    const [setting_data, setSettingData] = React.useState(false)
    const [successData, setSuccessData] = React.useState(false)
    const [field_data, setFieldData] = React.useState({
      password: {
        current_password: null,
        new_password: null,
        new_password_confirm: null
      }
    })
    function handleFieldChange(event){
      var user_info = user_data
      if (event.target.id.includes('name')){
        user_info.name = event.target.value
      }
      if (event.target.id.includes('email')){
        user_info.email = event.target.value
      }
      if (event.target.id.includes('email') || event.target.id.includes('name')){
        setUserData({
          email: user_info.email,
          name: user_info.name
        })
      }
      var auth_data = field_data
      var {current_password, new_password, new_password_confirm} = auth_data.password
      if (event.target.id == 'new_password_confirm'){
        new_password_confirm = event.target.value
      }
      if (event.target.id == 'new_password'){
        new_password = event.target.value
      }
      if (event.target.id == 'current_password'){
        current_password = event.target.value
      }

      if (event.target.id == 'new_password_confirm' || event.target.id == 'new_password' || event.target.id == 'current_password'){
        console.log(event.target.id)
        setFieldData({
          password: {
            current_password: current_password,
            new_password: new_password,
            new_password_confirm: new_password_confirm
          }
        })
      }
      
    }
    async function savePersonal(){
      setSettingData(true)
      var email = user_data.email
      var name = user_data.name
      updateProfile(auth.currentUser, {
        displayName: `${name}`,
        email: email
      }).then(() => {
        const userInfo = auth.currentUser
        if (userInfo.email != email){
          updateEmail(auth.currentUser, email).then(() => {
            setSettingData(false)
            setSuccessData(true)
            setTimeout(function(){
              setSuccessData(false)
            }, 1000)
          }).catch((error => {
            console.log(error)
            setSettingData(false)
          }))
        } else {
          setSettingData(false)
          setSuccessData(true)
          setTimeout(function(){
            setSuccessData(false)
          }, 1000)
        }

      }).catch((error) => {
        setSettingData(false)
        console.log(error)
      })

    }
    return (
      <>
           <Typography fontWeight={500} variant="h4" component="h4">
            Your Account
          </Typography>
          {/* <>{user_data.email ? <Fade in={true}><Typography>{user_data.email}</Typography></Fade> : ""}</>
          <>{user_data.email ? <Typography>{user_data.email}</Typography> : ""}</> */}
                      <Typography mt={2} mb={1} variant="h6" component="h6">Personal Information</Typography>
          <Box component={Paper} variant="outlined">
          <Grid container direction="row">
            
          
                    <Grid item sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Full Name</Typography>
                        <TextField id="name" onChange={handleFieldChange} value={user_data.name ? user_data.name : ""}></TextField>
                    </Grid>
                    <Grid sx={{ m: 2 }}>
                        <Typography variant="subtitle1" onChange={handleFieldChange} component="p" fontWeight={500}>Email <Chip color="error" size="small" label={"Not Verified"} /></Typography>
                        <TextField sx={{width: '15rem'}} id="email" onChange={handleFieldChange} value={user_data.email ? user_data.email : ""}></TextField>
                    </Grid>

                </Grid>
                <Divider />
                    <LoadingButton loading={setting_data} sx={{m: 2}} onClick={() => savePersonal()} variant="contained">{successData ? <CheckIcon/> : "Save"}</LoadingButton>
            </Box>

            <Typography mt={2} mb={1} variant="h6" component="h6">Authentication</Typography>

            <Box component={Paper} variant="outlined">
          <Grid container direction="row">
            

                    <Grid item sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Change Password</Typography>
                        <TextField type="password" sx={{mt: 1, width: '15rem'}}id="current_password" label="Current Password" onChange={handleFieldChange} value={field_data.password.current_password ? field_data.password.current_password : ""}></TextField>
                        <Divider />
                        <TextField type="password" sx={{mt: 2, width: '15rem'}} id="new_password" label="New Password" onChange={handleFieldChange} value={field_data.password.new_password ? field_data.password.new_password : ""}></TextField>
                        <Divider />
                        <TextField type="password" sx={{mt: 2, width: '15rem'}} required={field_data.password.new_password ? true : false} id="new_password_confirm" label="Confirm New Password" onChange={handleFieldChange} value={field_data.password.new_password_confirm ? field_data.password.new_password_confirm : ""}></TextField>

                    </Grid>
                    <Grid item sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>2-Factor Authentication</Typography>
                        <Typography>2-Factor Authentication is currently disabled.</Typography>
                        <Button sx={{mt: 2}} variant="contained">Enable</Button>
                    </Grid>

                </Grid>
                <Divider />
                    <LoadingButton loading={setting_data} sx={{m: 2}} onClick={() => savePersonal()} variant="contained">{successData ? <CheckIcon/> : "Save"}</LoadingButton>
            </Box>
            </>

    )
  }
  
  export default AccountContainerInstances