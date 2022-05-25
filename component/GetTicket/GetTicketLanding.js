import { Alert, Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadingTicketGroup, setTicket, setTicketGroup, setTicketGroupCode } from "../../store/ticketSlice";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import InfoIcon from "@mui/icons-material/Info";
import { useSnackbar } from "notistack";
import { useContextTicket } from "../../contexts/ticketContext";
import { useContextLang } from "../../contexts/LangContext";
import LangChanger from "../langChanger";

const GetTicketLanding = (props) => {
	const [error, setError] = useState({ error: false, message: "" });
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const { liffState } = props;
	const liff = liffState.liff;
	const ticketState = useSelector((state) => state.ticket);
	const ticketContext = useContextTicket();
	const lang = useContextLang();

	const fetchTicketGroup = async (ticketGroupCode) => {
		console.log("fetchTicketGroup ", ticketGroupCode);
		if (typeof ticketGroupCode == "undefined") return false;
		const snackKey = enqueueSnackbar("Loading information", { variant: "default" });
		dispatch(loadingTicketGroup());
		const ticketGroup = await ticketContext.getTicketGroupByCode(ticketGroupCode);
		// console.log(ticketGroup);
		dispatch(setTicketGroup({ ticketGroup: ticketGroup || null }));
		closeSnackbar(snackKey);
		if (!ticketGroup) {
			setError({ error: true, message: "Data not found" });
		}
		if (ticketGroup.exist_ticket) {
			dispatch(setTicket({ ticket: ticketGroup.exist_ticket }));
		}
		return ticketGroup;
	};

	const scanCodeHandler = (event) => {
		event.preventDefault();
		setError({ error: false, message: "" });

		if (typeof liff == "undefined") return false;

		dispatch(loadingTicketGroup());

		try {
			liff.scanCodeV2().then((result) => {
				// result = { value: "" }
				const ticketGroupCode = result.value;
				if (!ticketGroupCode) {
					dispatch(setTicketGroupCode({ ticketGroupCode: null }));
					return;
				}
				dispatch(setTicketGroupCode({ ticketGroupCode }));
				fetchTicketGroup(ticketGroupCode).then((result) => {
					// console.log("Scan code Result ", result);
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

	useEffect(() => {
		if (error.error && ticketContext.errorState.error) {
			enqueueSnackbar(lang.ticket?.error[ticketContext.errorState.code], { variant: "error", autoHideDuration: 5000 });
			setError((prevState) => {
				return { ...prevState, message: lang.ticket?.error[ticketContext.errorState.code] };
			});
		}
	}, [enqueueSnackbar, error.error, lang.ticket?.error, ticketContext.errorState.code, ticketContext.errorState.error]);

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
			{error.error && (
				<Box sx={{ mt: 4 }}>
					<Alert severity="error">{error.message}</Alert>
				</Box>
			)}
			<Box sx={{ mt: 6 }}>
				<Button onClick={scanCodeHandler} disabled={ticketState.loadingTicketGroup} color="primary" variant="contained" size="large" sx={{ py: 2 }} fullWidth>
					<Typography component="div">
						{ticketState.loadingTicketGroup && (
							<>
								<CircularProgress />
								<br />
							</>
						)}
						<QrCodeScannerIcon fontSize="large" />
						<br />
						{lang.ticket?.label?.scanCode || "Scan Code"}
					</Typography>
				</Button>
			</Box>
			<Typography component="p" variant="subtitle1" color="gray">
				<InfoIcon fontSize="inherit" /> {lang.ticket?.message?.scanCodeInfo || "Scan QR Code to get queue ticket"}
			</Typography>

			<Box sx={{ mt: 6 }}>
				{!ticketState.loadingTicketGroup && (
					<Button onClick={closeHandler} sx={{ py: 2, fontWeight: "bold" }} color="error" variant="contained" size="large" fullWidth>
						{lang.ticket?.label?.close || "Close"}
					</Button>
				)}
			</Box>

			<Box sx={{}}></Box>
		</Container>
	);
};

export default GetTicketLanding;
