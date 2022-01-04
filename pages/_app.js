import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import theme from "../components/theme";
import "../styles/globals.css";
import "../public/css/progress.css";
import "nprogress/nprogress.css";
import Router from "next/router";
import NProgress from "nprogress";
import axios from "axios";
import { SWRConfig } from "swr";
import nookies from "nookies";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useEffect, useState } from "react";
import Navigation from "../components/instance/Navigation";
config.autoAddCss = false;

NProgress.configure({ showSpinner: false });

axios.interceptors.request.use(async (config) => {
	if (process.browser) {
		var running = false;
		if (
			!nookies.get(null).access_token &&
			nookies.get(null).refresh_token &&
			!running
		) {
			running = true;
			await fetch("/api/v1/client/auth/refresh_access_token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					refresh_token: nookies.get(null).refresh_token,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					nookies.set(null, "access_token", data.data.access_token, {
						expires: new Date(new Date().getTime() + 15 * 60000),
						path: "/",
					});
					running = false;
				})
				.catch((err) => {
					nookies.destroy(null, "refresh_token");
					window.location.href = "/auth/login"
				});
		}
		config.headers.authorization = `Bearer ${nookies.get(null).access_token}`;
	}
	return config;
});
function localStorageProvider() {
	if (typeof window !== "undefined") {
		var localStorage = window.localStorage;
		// When initializing, we restore the data from `localStorage` into a map.
		const map = new Map(JSON.parse(localStorage.getItem("app-cache") || "[]"));

		// Before unloading the app, we write back all the data into `localStorage`.
		window.addEventListener("beforeunload", () => {
			const appCache = JSON.stringify(Array.from(map.entries()));
			localStorage.setItem("app-cache", appCache);
		});

		// We still use the map for write & read for performance.
		return map;
	} else return new Map();
}
function MyApp({ Component, pageProps }) {
	const [instance, setInstance] = useState(null);
	const [instanceNav, setInstanceNav] = useState(null)

	Router.onRouteChangeError = () => NProgress.done();
	useEffect(() => {
		if (window.location.pathname.includes("instance")) {
		if (window.location.pathname.split("instance")[1].split("/")[1] != undefined) {
			setInstance(window.location.pathname.split("instance")[1].split("/")[1])
			if (window.location.pathname.split("instance")[1].split("/")[2] != null) {
				setInstanceNav(window.location.pathname.split("instance")[1].split("/")[2])
			} else {
				setInstanceNav(null)
			}
		}
	} else {
		setInstance(null)
		setInstanceNav(null)
	}
		Router.onRouteChangeStart = (url) => {
			NProgress.start();
		};
		Router.onRouteChangeComplete = (url) =>{ 
			if (url.includes("instance")) {
				if (url.split("instance")[1].split("/")[1] != undefined) {
					setInstance(url.split("instance")[1].split("/")[1]);
					if (url.split("instance")[1].split("/")[2] != null) {
						setInstanceNav(url.split("instance")[1].split("/")[2])
					} else {
						setInstanceNav(null)
					}
				} else {
					setInstance(null)
					setInstanceNav(null)
				}
			} else {
				setInstance(null)
				setInstanceNav(null)
			}
			NProgress.done()}	}, [])
	return (
		<SWRConfig value={{ provider: localStorageProvider }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{instance ? <Navigation instance={instance} page={instanceNav}>
					<Component {...pageProps} />
				</Navigation>: <Component {...pageProps} />}
				{instanceNav ? instanceNav : ""}
			</ThemeProvider>
		</SWRConfig>
	);
}

export default MyApp;
