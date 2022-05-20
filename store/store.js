import { configureStore } from "@reduxjs/toolkit";
import ticketReducer from "./ticketSlice";

export default configureStore({
	reducer: {
		ticket: ticketReducer,
	},
});
