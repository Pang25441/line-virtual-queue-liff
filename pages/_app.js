import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import HttpContextProvider from "../contexts/HttpContext";
import { Provider } from "react-redux";
import "../styles/globals.css";
import store from "../store/store";
import { SnackbarProvider } from "notistack";
import TicketContextProvider from "../contexts/ticketContext";
import LangContextProvider from "../contexts/LangContext";

const theme = createTheme({ palette: { mode: "light" }, typography: { fontFamily: "Kanit" } });

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<SnackbarProvider
				maxSnack={5}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			>
				<LangContextProvider>
					<HttpContextProvider>
						<TicketContextProvider>
							<Provider store={store}>
								<Component {...pageProps} />
							</Provider>
						</TicketContextProvider>
					</HttpContextProvider>
				</LangContextProvider>
			</SnackbarProvider>
		</ThemeProvider>
	);
}

export default MyApp;
