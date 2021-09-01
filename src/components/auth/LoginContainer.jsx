import {
    TextField,
    Container,
    FormControl,
    Box,
    Skeleton,
    Grid,
    Typography,
    Button,
    Hidden,
    CardMedia,
    Alert,
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check';
import React from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import LoadingButton from '@material-ui/lab/LoadingButton';



function LoginContainer(props) {
    var gun = props.gun
    const user = gun.user();
    const [values, setValues] = React.useState({
        email: '',
        password: ''
    })
    const [error, setError] = React.useState(null)
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
      };
      const [loggedIn, setLoggedIn] = React.useState(null)
      const [loggingIn, setLoggingIn] = React.useState(false)
    function login(e){
        e.preventDefault();
        setLoggingIn(true);
        user.auth(`${values.email}`, `${values.password}`, function(data){
            if (data.err){
                console.log("The login failed")
            } else {
                console.log("The login was successful")
                //Cookies.set('token', 'test')
                return(
                setLoggedIn(true)
                )
            }
        })
/*         axios.post(`http://api.hye.gg:3000/api/v1/client/auth/login`, {
            email: values.email,
            password: values.password
        }).then(function(response){
            if (response.data.status == "error"){
                setLoggingIn(false)
                setError(response.data)
            }
            if (response.data.status == "success"){
                Cookies.set('token', response.data.data.token)
                return(
                    setLoggedIn(true)
                )
            }
        }).catch(function(error){
            setLoggingIn(false)
            setError({
                "status": "error",
                "data": {
                    "field": "none",
                    "message": "An error occured while trying to log you in. Please try again later."
                }
            })
        }) */
    }

    function createUser(){
        /*user.create('test', 'testing12345', function(key){
            console.log(key)
        //})*/
        user.create('testing@test.com', 'testing12345', function(data){
            if (data.err){
                console.log("The login failed")
            } else {
                console.log("The login was successful")
                return(
                setLoggedIn(true)
                )
            }
        })
    }
    return (
        <Container>
            {loggedIn == true ? <Redirect to="/" /> : ""}
            {loggedIn == true ? <p>Logged in!</p> : ""}
            {loggedIn == true ? console.log('yes it works') : ""}
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                mt={8}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Hidden only={["sm", "xs"]}>
                        <Box component="img" mt={20} src="https://hyehosting.com/images/logo.png" style={{ width: "10rem" }} />
                    </Hidden>
                    <Hidden only={["md", "lg", "xl"]}>
                        <img src="https://hyehosting.com/images/logo.png" width="150px" alt="logo" />
                    </Hidden>
                    {error && error.data.field == "none" || error && error.data.field == "none"? <Alert mt={2} severity="error">{error.data.message}</Alert> :                    <Typography align="center" mt={1} variant="subtitle1">
                        <Hidden only={["sm", "xs"]}>
                            Welcome to Ararat! Please login with your account.
                        </Hidden>
                    </Typography>}
                    <Hidden only={["sm", "xs"]}>
                        <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                        <TextField error={error && error.data.field == "email" && error.data.field !="none" || error && error.data.field == "all" && error.data.field !="none"} helperText={error && error.data.field != 'all' && error.data.field !="none" ? error.data.message : ""} value={values.email} onChange={handleChange('email')} margin="dense" id="Email" label="Email" variant="outlined" type="email" />
                            <TextField error={error && error.data.field == "password" && error.data.field !="none" || error && error.data.field == "all" && error.data.field !="none"} value={values.password} onChange={handleChange('password')} margin="dense" id="Password" label="Password" variant="outlined" type="password" />
                            <Box component="div" mb={1} />
                            <LoadingButton loading={loggingIn} onClick={login} variant="contained" disabled={values.email == '' || !values.email.includes('@') || !values.email.includes('.') || values.password == ''}>Login</LoadingButton>
                        </FormControl>
                    </Hidden>
                    <Hidden only={["md", "lg", "xl"]}>
                        <FormControl sx={{ m: 1, width: '30ch' }} variant="outlined">
                            <TextField error={error && error.data.field == "email" && error.data.field !="none" || error && error.data.field == "all" && error.data.field !="none"} helperText={error && error.data.field != 'all' && error.data.field !="none" ? error.data.message : ""} value={values.email} onChange={handleChange('email')} margin="dense" id="Email" label="Email" variant="outlined" type="email" />
                            <TextField error={error && error.data.field == "password" && error.data.field !="none "|| error && error.data.field == "all" && error.data.field !="none"} value={values.password} onChange={handleChange('password')} margin="dense" id="Password" label="Password" variant="outlined" type="password" />
                            <Box component="div" mb={1} />
                            <LoadingButton loading={loggingIn} onClick={login} variant="contained" disabled={values.email == '' || !values.email.includes('@') || !values.email.includes('.') || values.password == ''}>Login</LoadingButton>
                        </FormControl>
                    </Hidden>
                    <Button variant="text">Forgot Password?</Button>
                    <Button onClick={() => createUser() }variant="text">Create Account</Button>
                </Grid>
            </Grid>
        </Container>
    )
}
export default LoginContainer