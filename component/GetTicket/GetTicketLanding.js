import { Alert, Box, Button, Container, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadingTicketGroup, setTicketGroup, setTicketGroupCode } from "../../store/ticketSlice";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import InfoIcon from "@mui/icons-material/Info";
import { useSnackbar } from "notistack";
import { useContextTicket } from "../../contexts/ticketContext";

const GetTicketLanding = (props) => {
	const [error, setError] = useState({ error: false, message: "" });
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const { liffState } = props;
	const liff = liffState.liff;
	const ticketState = useSelector((state) => state.ticket);
	const ticketContext = useContextTicket();

	const fetchTicketGroup = async (ticketGroupCode) => {
		console.log("fetchTicketGroup ", ticketGroupCode);
		if (typeof ticketGroupCode == "undefined") return false;
		const snackKey = enqueueSnackbar("Loading information", { variant: "default" });
		dispatch(loadingTicketGroup());
		const ticketGroup = await ticketContext.getTicketGroupByCode(ticketGroupCode);
		console.log(ticketGroup);
		dispatch(setTicketGroup({ ticketGroup: ticketGroup || null }));
		closeSnackbar(snackKey);
		if (!ticketGroup) {
			enqueueSnackbar("Data not found", { variant: "error" });
			setError({ error: true, message: "Data not found" });
		}
		return ticketGroup;
	};

	const scanCodeHandler = (event) => {
		event.preventDefault();
		setError({ error: false, message: "" });

		if (typeof liff == "undefined") return false;

		try {
			liff.scanCodeV2().then((result) => {
				// result = { value: "" }
				const ticketGroupCode = result.value;
				dispatch(setTicketGroupCode({ ticketGroupCode }));
				fetchTicketGroup(ticketGroupCode).then((result) => {
					console.log("Scan code Result ", result);
				});
			});
		} catch (error) {
			setError({ error: true, message: "Application not initialized" });
			dispatch(setTicketGroupCode({ ticketGroupCode: null }));
		}
	};

	const closeHandler = (event) => {
		event.preventDefault();
		if (typeof liff == "undefined") return false;
		try {
			liff.closeWindow();
		} catch (error) {
			setError({ error: true, message: "Application not initialized" });
		}
	};

	return (
		<Container maxWidth="xs" sx={{ textAlign: "center" }}>
			<Box sx={{ mt: 6 }}>
				<Typography component="h1" variant="h1" sx={{ fontWeight: "bold" }}>
					LVQ
				</Typography>
				<Typography component="p" variant="subtitle1">
					LINE Virtual Queue
				</Typography>
			</Box>
			{error.error && (
				<Box sx={{ mt: 6 }}>
					<Alert severity="error">
						{error.message}
						{ticketContext.errorState.error && ticketContext.errorState.msg}
					</Alert>
				</Box>
			)}
			<Box sx={{ mt: 6 }}>
				<Button onClick={scanCodeHandler} disabled={ticketState.loadingTicketGroup} color="success" variant="contained" size="large" sx={{ py: 2 }} fullWidth>
					<Typography component="div">
						<QrCodeScannerIcon fontSize="large" />
						<br />
						Get Queue
					</Typography>
				</Button>
			</Box>
			<Typography component="p" variant="subtitle1" color="gray">
				<InfoIcon fontSize="inherit" /> Scan QR Code to get queue ticket
			</Typography>

			<Box sx={{ mt: 6 }}>
				<Button onClick={closeHandler} sx={{ py: 2 }} color="error" variant="contained" size="large" fullWidth>
					Close
				</Button>
			</Box>
		</Container>
	);
};

export default GetTicketLanding;
