import { Box, Button, Container, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { setTicketGroupCode } from "../../store/ticketSlice";

const GetTicketLanding = (props) => {
	const [error, setError] = useState({ error: false, message: "" });
	const { liff } = props;
	const dispatch = useDispatch();

	const scanCodeHandler = (event) => {
		event.preventDefault();
		// if (typeof props.onScanCode == "function") props.onScanCode();

		if (typeof liff == "undefined") return false;

		try {
			liff.scanCodeV2().then((result) => {
				// result = { value: "" }
				dispatch(setTicketGroupCode({ ticketGroupCode: result.value }));
			});
		} catch (error) {
			setError({ error: true, message: "Application not initialized" });
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
				<Typography component="h4" variant="h4">
					LVQ
				</Typography>
			</Box>
			{error.error && (
				<Box sx={{ mt: 6 }}>
					<Typography component="p" variant="subtitle1" color="red">
						{error.message}
					</Typography>
				</Box>
			)}
			<Box sx={{ mt: 6 }}>
				<Button onClick={scanCodeHandler} color="primary" variant="contained" fullWidth>
					Get Queue
				</Button>
			</Box>
			<Box sx={{ mt: 3 }}>
				<Button onClick={closeHandler} color="primary" variant="contained" fullWidth>
					Close
				</Button>
			</Box>
		</Container>
	);
};

export default GetTicketLanding;
