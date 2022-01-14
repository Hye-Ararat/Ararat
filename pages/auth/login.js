import { Container, FormControl, Grid, TextField, Typography, Button, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Check } from "@mui/icons-material";
import logo from "../../public/logo.png";
import Image from "next/image";
import { Box } from "@mui/system";
import Link from "next/link";
import Head from "next/head";
import login from "../../scripts/api/v1/auth/login";
import { useState } from "react";
import { useRouter } from "next/router";
import nprogress, { render } from "nprogress";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const loginUser = async () => {
    try {
      setLoggingIn(true);
      await login(email, password);
    } catch (error) {
      setLoggingIn(false);
      setLoginErr(error);
    }
    setLoggingIn(false);
    render(<Check color="success" />);
    router.push("/");
  };
  return (
    <>
      <Head>
        <title>Login | Ararat</title>
      </Head>
      <Container>
        <Grid container direction="column" justifyContent="center" alignItems="center" mt={30}>
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Image src={logo} width={160} height={85.16} />
            <Typography align="center" mt={1} variant="subtitle1">
              Welcome to Ararat! Please login to continue.
            </Typography>
            <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
              {loginErr && <Alert severity="error">{loginErr}</Alert>}
              <TextField
                onChange={(e) => setEmail(e.target.value)}
                margin="dense"
                placeholder="Email"
                variant="outlined"
                type="email"
              />
              <TextField
                onChange={(e) => setPassword(e.target.value)}
                margin="dense"
                placeholder="Password"
                variant="outlined"
                type="password"
              />
              <Box component="div" sx={{ mt: 1 }}>
                <LoadingButton
                  loading={loggingIn}
                  onClick={loginUser}
                  sx={{ width: "100%" }}
                  variant="contained"
                  color="primary"
                >
                  Login
                </LoadingButton>
              </Box>
            </FormControl>
            <Button variant="text">Forgot Password?</Button>
            <Link href="/auth/signup">
              <Button variant="text">Create Account</Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
