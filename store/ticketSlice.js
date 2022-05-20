import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedTicketGroupCode: null,
	selectedTicketGroup: null,
	ticket: null,
};

const ticketSlice = createSlice({
	name: "ticket",
	initialState,
	reducers: {
		setTicketGroupCode(state, action) {
			const { ticketGroupCode } = action.payload;
			state.selectedTicketGroupCode = ticketGroupCode;
		},
		setTicketGroup(state, action) {
			const { ticketGroup } = action.payload;
			state.selectedTicketGroup = ticketGroup;
		},
		setTicket(state, action) {
			const { ticket } = action.payload;
			state.ticket = ticket;
		},
	},
});

export const { setTicketGroupCode, setTicketGroup, setTicket } = ticketSlice.actions;

export default ticketSlice.reducer;
