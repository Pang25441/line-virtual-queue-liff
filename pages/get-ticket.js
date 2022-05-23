import { Button, Typography } from "@mui/material";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "../component/head";
import LiffReducer from "../store/liffStateReducer";
import getLiff from "../util/getLiff";
import GetTicketLanding from "../component/GetTicket/GetTicketLanding";
import GetTicketConfirm from "../component/GetTicket/GetTicketConfirm";
import GetTicketSuccess from "../component/GetTicket/GetTicketSuccess";
import { useSnackbar } from "notistack";
import { useContextTicket } from "../contexts/ticketContext";

export default function GetTicketPage(props) {
	const { liffId } = props;

	const [liffState, liffDispatch] = LiffReducer();

	const ticketState = useSelector((state) => state.ticket);
	const dispatch = useDispatch();

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const ticketContext = useContextTicket();

	useEffect(() => {
		if (liffId && !liffState.isInit) {
			getLiff(liffId, liffDispatch).then((res) => {
				const [liff, success, err] = res;
				console.log(liff);
				if (success) {
					liffDispatch({ type: "INIT_OK", liff: liff });
				} else {
					console.log("Liff Initial failed", err);
					liffDispatch({ type: "INIT_FAIL", message: "Liff Initial failed" });
				}
			});
		}
	}, [liffDispatch, liffId, liffState.isInit]);

	useEffect(() => {
		if (liffState.liff && liffState.isInit && !liffState.profile) {
			console.log("App Ready");
			liffState.liff
				.getProfile()
				.then((profile) => {
					liffDispatch({ type: "PROFILE", profile: profile });
				})
				.catch((err) => {
					console.log("Get Profile failed", err);
					liffDispatch({ type: "ERROR", message: "Cannot Get Profile" });
				});
		}
	}, [liffDispatch, liffState.isInit, liffState.liff, liffState.profile]);

	useEffect(() => {
		ticketContext.setAccessToken(liffState.accessToken);
	}, [liffState.accessToken, ticketContext]);

	useEffect(() => {
		if (liffState.profile) {
			console.log(liffState.profile);
		}
	}, [liffState.profile]);

	useEffect(() => {
		if (!ticketState.selectedTicketGroupCode) return;
		console.log("Ticket Group Code ", ticketState.selectedTicketGroupCode);
	}, [ticketState.selectedTicketGroupCode]);

	const head = <Head title="Get Ticket" />;

	// Initial
	if (!liffState.isInit) {
		return (
			<Fragment>
				{head}
				<Typography component="h3" variant="h3" sx={{ margin: "auto", textAlign: "center", mt: 6 }}>
					Loading
				</Typography>
			</Fragment>
		);
	}

	return (
		<Fragment>
			{head}
			{/*Landing*/}
			{!ticketState.selectedTicketGroup && <GetTicketLanding liffState={liffState} />}

			{/* Confirm Ticket */}
			{ticketState.selectedTicketGroup && <GetTicketConfirm liffState={liffState} />}

			{/* Ticket Result */}
			{ticketState.ticket && <GetTicketSuccess liff={liffState.liff} />}
		</Fragment>
	);
}

export async function getStaticProps() {
	const liffId = process.env.LIFF_ID_GET_TICKET || null;
	return {
		props: {
			liffId,
		},
	};
}
