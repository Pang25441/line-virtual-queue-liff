import { Alert, Box, Button, CircularProgress, Container, Divider, Grid, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContextTicket } from "../../contexts/ticketContext";
import { loadingNewTicket, setTicket, setTicketGroupCode } from "../../store/ticketSlice";
import Styles from "../../styles/TicketConfirm.module.css";

const GetTicketConfirm = (props) => {
	const [error, setError] = useState({ error: false, message: "" });
	const [selectedTicketGroup, setSelectedTicketGroup] = useState(null);
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const ticketState = useSelector((state) => state.ticket);
	const ticketContext = useContextTicket();

	const confirmQueueHandler = async (event) => {
		event.preventDefault();
		setError((prevState) => {
			return { ...prevState, error: false };
		});
		const snackKey = enqueueSnackbar("Generate Ticket");
		dispatch(loadingNewTicket());

		const newTicket = (await ticketContext.generateTicket(ticketState.selectedTicketGroupCode)) || null;

		closeSnackbar(snackKey);

		if (!newTicket) {
			enqueueSnackbar("Generate Ticket", { variant: "error", autoHideDuration: 5000 });
			setError(() => {
				return { error: true, message: "Cannot generate ticket" };
			});
		}

		dispatch(setTicket({ ticket: newTicket }));
	};

	const cancelQueueHandler = (event) => {
		event.preventDefault();

		dispatch(setTicketGroupCode({ ticketGroupCode: null }));
	};

	useEffect(() => {
		setSelectedTicketGroup(ticketState.selectedTicketGroup);
		console.log("setSelectedTicketGroup", ticketState.selectedTicketGroup);
	}, [ticketState.selectedTicketGroup]);

	console.log(Styles["grid-border"]);

	return (
		<Container maxWidth="xs" sx={{ textAlign: "center" }}>
			<Box sx={{ mt: 0 }}>
				<Typography component="h1" variant="h1" sx={{ fontWeight: "bold" }}>
					LVQ
				</Typography>
				<Typography component="p" variant="subtitle1">
					LINE Virtual Queue
				</Typography>
			</Box>
			<Divider sx={{ my: 1 }} />
			{selectedTicketGroup && !ticketState.loadingNewTicket && (
				<>
					<Typography component="h5" variant="h5">
						{selectedTicketGroup.queue_setting.display_name}
					</Typography>
					<Typography component="p" variant="subtitle1">
						{selectedTicketGroup.queue_setting.detail}
					</Typography>

					<Grid container spaceing={0} sx={{ mt: 2 }}>
						<Grid item xs={12} className={Styles["grid-border"]}>
							{selectedTicketGroup.description}
						</Grid>
						<Grid item xs={4} className={Styles["grid-border"]}>
							<Typography component="h3" variant="h3">
								{selectedTicketGroup.ticket_group_prefix}
							</Typography>
						</Grid>
						<Grid item xs={8} className={Styles["grid-border"]}>
							<Typography component="p" variant="body1">
								Waiting Queue
							</Typography>
							<Typography component="p" variant="body1">
								{selectedTicketGroup.waiting_queue || 0}
							</Typography>
						</Grid>
					</Grid>

					{error.error && (
						<Box sx={{ my: 1 }}>
							<Alert severity="error">
								{error.message}
								<br />
								{ticketContext.errorState.error && ticketContext.errorState.msg}
							</Alert>
						</Box>
					)}

					<Button onClick={confirmQueueHandler} color="primary" variant="contained" fullWidth sx={{ my: 3, py: 2 }}>
						Get Queue Ticket
					</Button>
					<Button onClick={cancelQueueHandler} color="error" variant="contained" fullWidth sx={{ my: 3, py: 2 }}>
						Cancel
					</Button>
				</>
			)}

			{ticketState.loadingNewTicket && (
				<>
					<Box sx={{ mt: 4 }}>
						<Typography component="h5" variant="h5">
							Generating Queue Ticket
						</Typography>
						<Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", my: 3 }}>
							<CircularProgress size={60} thickness={5} />
						</Box>
					</Box>
				</>
			)}
		</Container>
	);
};

export default GetTicketConfirm;
