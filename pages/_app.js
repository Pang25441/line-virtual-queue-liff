import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import HttpContextProvider from "../contexts/HttpContext";
import { Provider } from "react-redux";
import "../styles/globals.css";
import store from "../store/store";

const theme = createTheme({ palette: { mode: "light" } });

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<HttpContextProvider>
				<Provider store={store}>
					<Component {...pageProps} />
				</Provider>
			</HttpContextProvider>
		</ThemeProvider>
	);
}

export default MyApp;
