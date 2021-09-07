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
    Switch
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
  import Gun from 'gun/gun';
import SEA from 'gun/sea';
import {LoadingButton} from '@material-ui/lab'
const gun = Gun({peers: ["https://db.hye.gg:8443/gun"]});
const user = gun.user().recall({sessionStorage: true})

const pair = user.pair()
  function AccountContainer() {
    const [user_data, setUserData] = React.useState({
    email: null,
    name: {
      first: null,
      last: null
    }})
    const [setting_data, setSettingData] = React.useState(false)
    const [successData, setSuccessData] = React.useState(false)
    const [field_data, setFieldData] = React.useState({
      password: {
        current_password: null,
        new_password: null,
        new_password_confirm: null
      }
    })
    React.useEffect(() => {
      let mounted = true
      user.get('email').on(async function(enc_email, key){
        var msg = await SEA.verify(enc_email, pair.pub) //msg
        var dec = await SEA.decrypt(msg, pair) //dec
        var proof = await SEA.work(dec, pair) //proof
        var check = await SEA.work(dec, pair) //check
        if (check === proof){
          let data = user_data
          user_data.email = dec
          if (mounted){
            setUserData({
              email: data.email,
              name: {
                first: data.name.first,
                last: data.name.last
              }
            })
          }
        }
      })
      user.get('name').on(function(name, key){
        async function firstName(name){
          let data = user_data
          var msg = await SEA.verify(name.first, pair.pub)
          var dec = await SEA.decrypt(msg, pair)
          var proof = await SEA.work(dec, pair)
          var check = await SEA.work(dec, pair)
          if (check === proof){
            user_data.name.first = dec
            if (mounted){
            setUserData({
              email: data.email,
              name: {
                first: data.name.first,
                last: data.name.last
              }
            })
          }
          }
        }
        async function lastName(name){
          var msg = await SEA.verify(name.last, pair.pub)
          var dec = await SEA.decrypt(msg, pair)
          var proof = await SEA.work(dec, pair)
          var check = await SEA.work(dec, pair)
          if (check === proof){
            let data = user_data
            user_data.name.last = dec
            setUserData({
              email: data.email,
              name: {
                first: data.name.first,
                last: data.name.last
              }
            })
          }
        }
        firstName(name)
        lastName(name)
        
      })
    }, [])
    function handleFieldChange(event){
      var user_info = user_data
      if (event.target.id.includes('first_name')){
        user_info.name.first = event.target.value
      }
      if (event.target.id.includes('last_name')){
        user_info.name.last = event.target.value
      }
      if (event.target.id.includes('email')){
        user_info.email = event.target.value
      }
      if (event.target.id.includes('email') || event.target.id.includes('first_name') || event.target.id.includes('last_name')){
        setUserData({
          email: user_info.email,
          name: {
            first: user_info.name.first,
            last: user_info.name.last
          }
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
      var email_enc = await SEA.encrypt(user_data.email, pair)
      var email = await SEA.sign (email_enc, pair)
      
      var firstName_enc = await SEA.encrypt(user_data.name.first, pair)
      var first_name = await SEA.sign(firstName_enc, pair)

      var lastName_enc = await SEA.encrypt(user_data.name.last, pair)
      var last_name = await SEA.sign(lastName_enc, pair)
      user.get('name').get('first').put(first_name)
      user.get('name').get('last').put(last_name)
      user.get('email').put(email)
      setSettingData(false)
      setSuccessData(true)
      setTimeout(function(){
        setSuccessData(false)
      }, 1000)
    }
    return (
      <Dashboard page="account">
           <Typography fontWeight={500} variant="h4" component="h4">
            Your Account
          </Typography>
          {/* <>{user_data.email ? <Fade in={true}><Typography>{user_data.email}</Typography></Fade> : ""}</>
          <>{user_data.email ? <Typography>{user_data.email}</Typography> : ""}</> */}
                      <Typography mt={2} mb={1} variant="h6" component="h6">Personal Information</Typography>
          <Box component={Paper} variant="outlined">
          <Grid container direction="row">
            
          
            <Fade in={user_data.name.first != null}>
                    <Grid item sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>First Name</Typography>
                        <TextField id="first_name" onChange={handleFieldChange} value={user_data.name.first ? user_data.name.first : ""}></TextField>
                    </Grid>
                    </Fade>
                    <Fade in={user_data.name.last != null}>
                    <Grid item sx={{ m: 2 }}>
                        <Typography variant="subtitle1" component="p" fontWeight={500}>Last Name</Typography>
                        <TextField id="last_name" onChange={handleFieldChange} value={user_data.name.last ? user_data.name.last : ""}></TextField>
                    </Grid>
                    </Fade>
                    <Fade in={user_data.email !=null}>
                    <Grid sx={{ m: 2 }}>
                        <Typography variant="subtitle1" onChange={handleFieldChange} component="p" fontWeight={500}>Email</Typography>
                        <TextField sx={{width: '15rem'}} id="email" onChange={handleFieldChange} value={user_data.email ? user_data.email : ""}></TextField>
                    </Grid>
                    </Fade> 

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

      </Dashboard>
    )
  }
  
  export default AccountContainer