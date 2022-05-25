import { Box, Button, CircularProgress, Container, Divider, Grid, Typography } from "@mui/material";
import { useContextLang } from "../../contexts/LangContext";
import Styles from "../../styles/TicketConfirm.module.css";

const GetTicketSuccess = (props) => {
	const { ticket, liffState } = props;

	const liff = liffState.liff;

	const lang = useContextLang();

	const closeAppHandler = (event) => {
		event.preventDefault();
		if (typeof liff == "undefined") return false;
		try {
			liff.closeWindow();
		} catch (error) {
			setError({ error: true, message: "Application not initialized" });
		}
	};

	return (
		<Container maxWidth="xs" sx={{ textAlign: "center", py: 1 }}>
			<Box sx={{ mt: 0 }}>
				<Typography component="h1" variant="h1" sx={{ fontWeight: "bold" }}>
					LVQ
				</Typography>
				<Typography component="p" variant="subtitle1">
					LINE Virtual Queue
				</Typography>
			</Box>

			<Divider sx={{ my: 1 }} />

			{ticket && (
				<>
					<Grid container spaceing={0} sx={{ mt: 2 }}>
						<Grid item xs={12} className={Styles["grid-border"]}>
							{ticket.ticket_group.description}
						</Grid>
						<Grid item xs={12} className={Styles["grid-border"]}>
							<Typography component="h3" variant="h3">
								{ticket.ticket_number}
							</Typography>
						</Grid>
					</Grid>

					<Box sx={{ mt: 0 }}>
						<Typography component="h1" variant="h1" sx={{ fontWeight: "bold" }}></Typography>
					</Box>
				</>
			)}
			{!ticket && (
				<>
					<Box sx={{ mt: 6 }}>
						<Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", my: 3 }}>
							<CircularProgress size={60} thickness={5} />
						</Box>
					</Box>
				</>
			)}

			<Box sx={{ mt: 6 }}>
				<Button onClick={closeAppHandler} sx={{ py: 2 }} color="success" variant="contained" fullWidth>
					{lang.ticket?.label?.close || "Close"}
				</Button>
			</Box>
		</Container>
	);
};

export default GetTicketSuccess;
