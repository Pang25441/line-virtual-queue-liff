import { Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "../component/head";
import LiffReducer from "../store/liffStateReducer";
import getLiff from "../util/getLiff";
import GetTicketLanding from "../component/GetTicket/GetTicketLanding";
import GetTicketConfirm from "../component/GetTicket/GetTicketConfirm";
import GetTicketSuccess from "../component/GetTicket/GetTicketSuccess";
import { useContextTicket } from "../contexts/ticketContext";
import LangChanger from "../component/langChanger";
import { useContextLang } from "../contexts/LangContext";
import { Box, Container } from "@mui/system";

export default function GetTicketPage(props) {
	const { liffId } = props;
	const [isLiffClient, setIsLiffClient] = useState(false);
	const [liffState, liffDispatch] = LiffReducer();

	const ticketState = useSelector((state) => state.ticket);
	const ticketContext = useContextTicket();
	const lang = useContextLang();

	useEffect(() => {
		if (liffId && !liffState.isInit) {
			getLiff(liffId, liffDispatch).then((res) => {
				const [liff, success, err] = res;
				if (success) {
					liffDispatch({ type: "INIT_OK", liff: liff });
				} else {
					console.log("Liff Initial failed", err);
					liffDispatch({ type: "INIT_FAIL", message: "Liff Initial failed" });
				}
			});
		}
	}, [liffDispatch, liffId, liffState.isInit]);

	// useEffect(() => {
	// 	if (liffState.liff && liffState.isInit && !liffState.profile) {
	// 		console.log("App Ready");
	// 		liffState.liff
	// 			.getProfile()
	// 			.then((profile) => {
	// 				liffDispatch({ type: "PROFILE", profile: profile });
	// 			})
	// 			.catch((err) => {
	// 				console.log("Get Profile failed", err);
	// 				liffDispatch({ type: "ERROR", message: "Cannot Get Profile" });
	// 			});
	// 	}
	// }, [liffDispatch, liffState.isInit, liffState.liff, liffState.profile]);

	useEffect(() => {
		if (liffState.isInit) {
			const _isLiffClient = liffState.liff.isInClient();
			setIsLiffClient(_isLiffClient);
		}
	}, [liffState.isInit, liffState.liff]);

	useEffect(() => {
		ticketContext.setAccessToken(liffState.accessToken);
	}, [liffState.accessToken, ticketContext]);

	// useEffect(() => {
	// 	if (liffState.profile) {
	// 		console.log(liffState.profile);
	// 	}
	// }, [liffState.profile]);

	useEffect(() => {
		if (!ticketState.selectedTicketGroupCode) return;
		// console.log("Ticket Group Code ", ticketState.selectedTicketGroupCode);
	}, [ticketState.selectedTicketGroupCode]);

	const head = <Head title="Get Ticket" />;

	// Initial
	if (!liffState.isInit || !isLiffClient) {
		return (
			<Fragment>
				{head}
				<Container maxWidth="xs" sx={{ textAlign: "center", py: 1 }}>
					<LangChanger sx={{}} />
					<Typography component="h3" variant="h3" sx={{ margin: "auto", textAlign: "center", mt: 6 }}>
						{!liffState.isInit && "Loading"}
						{liffState.isInit && !isLiffClient && (lang.ticket?.message?.notLineApp || "Please Use LINE Application")}
					</Typography>
				</Container>
			</Fragment>
		);
	}

	return (
		<Fragment>
			{head}
			<LangChanger sx={{}} />
			{/*Landing*/}
			{!ticketState.selectedTicketGroup && <GetTicketLanding liffState={liffState} />}

			{/* Confirm Ticket */}
			{ticketState.selectedTicketGroup && !ticketState.ticket && <GetTicketConfirm />}

			{/* Ticket Result */}
			{ticketState.ticket && <GetTicketSuccess liffState={liffState} ticket={ticketState.ticket} />}
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
