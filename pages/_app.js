import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import theme from "../components/theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default MyApp;
