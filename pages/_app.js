import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import theme from "../components/theme";
import "../styles/globals.css";
import "../public/css/progress.css"
import "nprogress/nprogress.css";
import Router from "next/router";
import NProgress from "nprogress";
import axios from "axios";
import { SWRConfig } from "swr";

NProgress.configure({ showSpinner: false});
Router.onRouteChangeStart = (url) => {
	NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

axios.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer EEEE`;
  return config;
})

function MyApp({ Component, pageProps }) {
	return (
    <SWRConfig value={{ provider: () => new Map() }}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
    </SWRConfig>
	);
}

export default MyApp;
