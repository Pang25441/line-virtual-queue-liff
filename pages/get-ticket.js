import { Button, Typography } from "@mui/material";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "../component/head";
import LiffReducer from "../store/liffStateReducer";
import getLiff from "../util/getLiff";
import { setTicketGroupCode } from "../store/ticketSlice";
import GetTicketLanding from "../component/GetTicket/GetTicketLanding";

export default function GetTicketPage(props) {
	const { liffId } = props;

	const [liffState, liffDispatch] = LiffReducer();

	const ticketState = useSelector((state) => state.ticket);
	const dispatch = useDispatch();

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
		if (liffState.profile) {
			console.log(liffState.profile);
		}
	}, [liffState.profile]);

	useEffect(() => {
		if (ticketState.selectedTicketGroupCode) console.log("Ticket Group ", ticketState.selectedTicketGroupCode);
	}, [ticketState.selectedTicketGroupCode]);

	const head = <Head title="Get Ticket" />;

	if (!liffState.isInit) {
		return (
			<Fragment>
				{head}
				<Typography component="h3" variant="h3" sx={{ margin: "auto", textAlign: "center", mt: 6 }}>
					Initializing
				</Typography>
			</Fragment>
		);
	}

    if(!ticketState.selectedTicketGroup) {
        return <Fragment>
            {head}
            <GetTicketLanding liff={liffState.liff} />
        </Fragment>
    }

	return (
		<Fragment>
			{head}
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
