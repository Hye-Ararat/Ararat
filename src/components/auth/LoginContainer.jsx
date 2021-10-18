import {
  TextField,
  Container,
  FormControl,
  Box,
  Grid,
  Typography,
  Button,
  Hidden,
  Alert,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import React from "react";
import { withRouter } from "react-router-dom";
import LoadingButton from "@material-ui/lab/LoadingButton";
import loginUser from "../../api/v1/auth/login";

function LoginContainer() {
  console.log(window.location.hostname);
  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState(null);
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const [loggedIn, setLoggedIn] = React.useState();
  const [loggingIn, setLoggingIn] = React.useState(false);
  function login(e) {
    // eslint-disable-next-line no-unused-vars
    var a = e ? e.preventDefault() : "";

    setLoggingIn(true);
    try {
      loginUser(values.email, values.password).then(() => {
        setLoggedIn(true);
      });
    } catch (error) {
      setLoggingIn(false);
      console.log(error);
    }
  }
  document.addEventListener("keydown", function ({ key }) {
    if (key == "Enter") login();
  });
  function createUser() {
    /*user.create('test', 'testing12345', function(key){
            console.log(key)
        //})*/
    /*         user.create('javmaldjian@gmail.com', 'helloworld', function(data){
            if (data.err){
                console.log("The login failed")
            } else {
                console.log("The login was successful")
                return(
                setLoggedIn(true)
                )
            }
        }) */
  }
  React.useEffect(() => {
    /*         console.log(user.is)
        if (user.is){
            setLoggedIn(true)
        } */
  }, []);
  return (
    <Container>
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
            <Box
              component="img"
              mt={20}
              src="/images/logo.png"
              style={{ width: "10rem" }}
            />
          </Hidden>
          <Hidden only={["md", "lg", "xl"]}>
            <img src="/images/logo.png" width="150px" alt="logo" />
          </Hidden>
          {(error && error.data.field == "none") ||
          (error && error.data.field == "none") ? (
            <Alert mt={2} severity="error">
              {error.data.message}
            </Alert>
          ) : (
            <Typography align="center" mt={1} variant="subtitle1">
              <Hidden only={["sm", "xs"]}>
                Welcome to Ararat! Please login with your account.
              </Hidden>
            </Typography>
          )}
          <Hidden only={["sm", "xs"]}>
            <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
              <TextField
                error={
                  (error &&
                    error.data.field == "email" &&
                    error.data.field != "none") ||
                  (error &&
                    error.data.field == "all" &&
                    error.data.field != "none")
                }
                helperText={
                  error &&
                  error.data.field != "all" &&
                  error.data.field != "none"
                    ? error.data.message
                    : ""
                }
                value={values.email}
                onChange={handleChange("email")}
                margin="dense"
                id="Email"
                placeholder="Email"
                variant="outlined"
                type="email"
              />
              <TextField
                error={
                  (error &&
                    error.data.field == "password" &&
                    error.data.field != "none") ||
                  (error &&
                    error.data.field == "all" &&
                    error.data.field != "none")
                }
                value={values.password}
                onChange={handleChange("password")}
                margin="dense"
                id="Password"
                placeholder="Password"
                variant="outlined"
                type="password"
              />
              <Box component="div" mb={1} />
              <LoadingButton
                loading={loggingIn && !loggedIn}
                onClick={login}
                variant="contained"
                disabled={
                  values.email == "" ||
                  !values.email.includes("@") ||
                  !values.email.includes(".") ||
                  values.password == ""
                }
              >
                {loggedIn ? <CheckIcon color="success" /> : "Login"}
              </LoadingButton>
            </FormControl>
          </Hidden>
          <Hidden only={["md", "lg", "xl"]}>
            <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
              <TextField
                error={
                  (error &&
                    error.data.field == "email" &&
                    error.data.field != "none") ||
                  (error &&
                    error.data.field == "all" &&
                    error.data.field != "none")
                }
                helperText={
                  error &&
                  error.data.field != "all" &&
                  error.data.field != "none"
                    ? error.data.message
                    : ""
                }
                value={values.email}
                onChange={handleChange("email")}
                margin="dense"
                id="Email"
                placeholder="Email"
                variant="outlined"
                type="email"
              />
              <TextField
                error={
                  (error &&
                    error.data.field == "password" &&
                    error.data.field != "none ") ||
                  (error &&
                    error.data.field == "all" &&
                    error.data.field != "none")
                }
                value={values.password}
                onChange={handleChange("password")}
                margin="dense"
                id="Password"
                placeholder="Password"
                variant="outlined"
                type="password"
              />
              <Box component="div" mb={1} />
              <LoadingButton
                loading={loggingIn && !loggedIn}
                onClick={login}
                variant="contained"
                disabled={
                  values.email == "" ||
                  !values.email.includes("@") ||
                  !values.email.includes(".") ||
                  values.password == ""
                }
              >
                {loggedIn ? <CheckIcon color="success" /> : "Login"}
              </LoadingButton>
            </FormControl>
          </Hidden>
          <Button variant="text">Forgot Password?</Button>
          <Button onClick={() => createUser()} variant="text">
            Create Account
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
export default withRouter(LoginContainer);
