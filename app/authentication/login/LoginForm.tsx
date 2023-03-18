"use client";
import { useEffect, useState } from "react";
import { FormControl, TextField, LoadingButton, Box } from "../../../components/base";

export default function LoginForm({interaction}) {
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginErr, setLoginErr] = useState("");
    useEffect(() => {
        document.onkeydown = (ev) => {
            if (ev.key === "Enter") loginUser();
        }
    }, [])
    const loginUser = async () => {
        setLoggingIn(true);
        let login = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let formData = new FormData();
        formData.append("login", login);
        formData.append("password", password);
        let res = await fetch(`/api/authentication/interaction/${interaction}/login`, {
            method: "POST",
            body: formData,
            cache: "no-cache"
        });
        window.location.href = res.url;
       setInterval(() => {
          window.location.href = res.url;
        }, 1000)
    }
    
    return (
        <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
                        <TextField
              id="email"
                margin="dense"
                placeholder="Email"
                variant="outlined"
                type="email"
              />
              <TextField
              id="password"
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
        )
}