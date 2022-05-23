import { Container, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContextTicket } from "../../contexts/ticketContext";

const GetTicketConfirm = (props) => {
	const [error, setError] = useState({ error: false, message: "" });
    const [selectedTicketGroup, setSelectedTicketGroup] = useState(null);
	const { liffState } = props;
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const ticketState = useSelector((state) => state.ticket);
	const ticketContext = useContextTicket();

    useEffect(()=>{
        setSelectedTicketGroup(ticketState.selectedTicketGroup);
        console.log("setSelectedTicketGroup", ticketState.selectedTicketGroup)
    },[ticketState.selectedTicketGroup])

	return (
		<Container maxWidth="xs" sx={{ textAlign: "center" }}>
            <Typography component="h2" variant="h2">Confirm</Typography>
			{selectedTicketGroup && "Group "+selectedTicketGroup.ticket_group_prefix}
            {/* {ticketState.selectedTicketGroup} */}
		</Container>
	);
};

export default GetTicketConfirm;
