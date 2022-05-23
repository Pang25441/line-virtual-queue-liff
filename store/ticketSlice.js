import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedTicketGroupCode: null,
	selectedTicketGroup: null,
	ticket: null,
	loadingTicketGroup: false,
	loadingNewTicket: false,
};

const ticketSlice = createSlice({
	name: "ticket",
	initialState,
	reducers: {
		setTicketGroupCode(state, action) {
			const { ticketGroupCode } = action.payload;
			state.selectedTicketGroupCode = ticketGroupCode;
			if (ticketGroupCode === null) {
				state.selectedTicketGroup = null;
				state.ticket = null;
                state.loadingTicketGroup = false;
                state.loadingNewTicket = false;
			}
		},
		setTicketGroup(state, action) {
			const { ticketGroup } = action.payload;
			state.loadingTicketGroup = false;
			state.selectedTicketGroup = ticketGroup;
		},
		setTicket(state, action) {
			const { ticket } = action.payload;
			state.loadingNewTicket = false;
			state.ticket = ticket;
		},
		loadingTicketGroup(state, action) {
			state.loadingTicketGroup = true;
		},
		loadingNewTicket(state, action) {
			state.loadingNewTicket = true;
		},
	},
});

export const { setTicketGroupCode, setTicketGroup, setTicket, loadingTicketGroup, loadingNewTicket } = ticketSlice.actions;

export default ticketSlice.reducer;
