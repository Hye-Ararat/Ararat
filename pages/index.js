import Head from "next/head";
import Image from "next/image";
import {
  Button,
  Typography,
  Grid,
  Dialog,
  Grow,
  DialogContent,
  Fade,
  Zoom,
  Select,
  MenuItem,
  DialogTitle,
} from "@mui/material";
import Link from "next/link";
import Instance from "../components/instance";
import prisma from "../lib/prisma"
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import translate, { languages } from "../translations/translations";
import { useEffect, useState } from "react";
import axios from "axios";
import nookies from "nookies";
import { useRouter } from "next/router";
import CreateInstance from "../components/instances/CreateInstance";
import Permissions from "../lib/permissions/index.js";
export async function getServerSideProps({ req, res }) {
  if (!req.cookies.access_token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    }
  }
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  var { decode } = require("jsonwebtoken");
  const user_data = decode(req.cookies.access_token)
  let createPerm = await new Permissions(user_data.id).createInstance;

  const instances = await prisma.instance.findMany({
    where: {
      users: {
        some: {
          userId: user_data.id
        }
      }
    }
  })
  let data = JSON.parse(JSON.stringify(instances));
  return { props: { data, user: user_data, canCreate: createPerm } };
}

export default function Dashboard({ data, user, canCreate }) {
  const router = useRouter();
  const [welcomeDialog, setWelcomeDialog] = useState(false);
  const [change, setChange] = useState(false);
  const [changeLangs, setChangeLangs] = useState(true);
  const [language, setLanguage] = useState("en");
  const [userLang, setUserLang] = useState(null);
  const [view, setView] = useState("welcome");
  const [creatingInstance, setCreatingInstance] = useState(false);
  useEffect(() => {
    if (!user.language) {
      setTimeout(() => {
        setWelcomeDialog(true);
      }, 2000)
    }
  }, [user])
  useEffect(() => {
    if (!user.language) {
      let lastLang = "en";
      let interval;
      if (changeLangs) {
        interval = setInterval(() => {
          const randomElement = languages[Math.floor(Math.random() * languages.length)];
          if (randomElement.code != lastLang) {
            setChange(true)
            setTimeout(() => {
              setLanguage(randomElement.code);
              lastLang = randomElement.code;
              setChange(false);
            }, 300)
          }
        }, 5000)
        return () => {
          clearInterval(interval)
        }
      }
    }
  }, [changeLangs, user])
  return (
    <>
      <Head>
        <title>Dashboard | Ararat</title>
      </Head>
      <Grid container direction="row">
        <Typography variant="h4" sx={{ mb: 1 }}>
          {translate(user.language, "instances", "your_instances")}
        </Typography>
        {canCreate ?
          <Button variant="contained" sx={{ ml: "auto", mt: "auto", mb: "auto" }} onClick={() => setCreatingInstance(true)}>{translate(user.language, "instances", "create_instance")}</Button>
          : ""}
      </Grid>
      {creatingInstance ?
        <CreateInstance setCreatingInstance={setCreatingInstance} />
        : ""}
      <Grid spacing={1} container direction="column">
        {data.map((instance) => {
          return <Instance instance={instance} key={instance.id} />;
        })}
      </Grid>
      <Dialog open={welcomeDialog} transitionDuration={{ appear: 0, enter: 1000, exit: 100 }} TransitionComponent={Grow} keepMounted>
        {view == "welcome" ?
          <DialogContent sx={{ minWidth: 430 }}>
            <Fade in={!change} exit={change}>
              <Typography align="center" variant="h2" sx={{ mr: "auto", mb: "auto", fontWeight: 600 }}>{translate(userLang ? userLang : language, "setup", "welcome")}</Typography>
            </Fade>
            <Fade in={true} style={{ transitionDelay: 2500 }}>
              <Typography align="center" variant="body1">{translate(language, "setup", "select_language")}</Typography>
            </Fade>
            <Select sx={{ minWidth: "100%", background: "#2a3138", mt: 1 }} value={language} onChange={(e) => {
              setUserLang(e.target.value);
              setLanguage(e.target.value);
              setChangeLangs(false);
            }}>
              {languages.map((lang) => {
                return (
                  <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                )
              }
              )}
            </Select>
            <Zoom in={true} style={{ transitionDelay: 3000, transitionDuration: 2000 }}>
              <Grid container direction="row">
                <Button onClick={async () => {
                  setChangeLangs(false);
                  await axios.patch(`/api/v1/users/${user.id}`, {
                    language: userLang ? userLang : language
                  })
                  setView("reauth");
                }} sx={{ mr: "auto", ml: "auto", mt: 2 }} variant="contained" color="primary">{translate(language, "setup", "continue")}</Button>
              </Grid>
            </Zoom>
          </DialogContent>
          : <>
            <DialogTitle>{translate(userLang, "setup", "reauth")}</DialogTitle>
            <DialogContent sx={{ minWidth: 430 }}>
              <Grid container>
                <Typography>{translate(userLang ? userLang : language, "setup", "reauth_desc")}</Typography>
                <Button onClick={() => {
                  nookies.destroy(null, "access_token");
                  nookies.destroy(null, "refresh_token");
                  router.replace("/auth/login");
                }} sx={{ mr: "auto", ml: "auto", mt: 2 }} variant="contained">{translate(userLang ? userLang : language, "setup", "sign_out")}</Button>
              </Grid>
            </DialogContent>
          </>}
      </Dialog>
      <Footer />
    </>
  );
}

Dashboard.getLayout = (page) => {
  return (
    <Navigation>
      {page}
    </Navigation>
  )
}
