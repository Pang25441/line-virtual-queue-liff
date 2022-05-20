import React from "react";
import { useContextHttp } from "./HttpContext";

const TicketContext = React.createContext({
	setAccessToken: (accessToken) => {},
	getTicketGroupByCode: async (ticketGroupCode) => {},
	generateTicket: async (ticketGroupCode) => {},
	getCurrentTicket: async () => {},
});

const TicketContextProvider = (props) => {
	const [errorState, setErrorState] = React.useState({ error: false, code: null, msg: null });
	const [accessToken, setAccessToken] = React.useState(null);
	const http = useContextHttp(accessToken);

	const getTicketGroupByCode = async (ticketGroupCode) => {
		const response = await http.post("queue/ticket/group_by_code", { ticket_group_code: ticketGroupCode });
		const [status, content, err] = await httpResponseHandler(response);
		if (status === false) return false;
		return content;
	};
	const generateTicket = async (ticketGroupCode) => {
        const response = await http.post("queue/ticket/generate", { ticket_group_code: ticketGroupCode });
		const [status, content, err] = await httpResponseHandler(response);
		if (status === false) return false;
		return content;
    };

    
	const getCurrentTicket = async () => {
        const response = await http.get("queue/ticket/my");
        const [status, content, err] = await httpResponseHandler(response);
		if (status === false) return false;
		return content;
    };

	const httpResponseHandler = async (response) => {
		if (!response.ok) {
			const err = { error: true, code: 0, msg: "HTTP Error " + response.status };
			setErrorState(err);
			console.log(response);
			return [false, null, err];
		}

		const content = response.json();
		if (!content) {
			const err = { error: true, code: 0, msg: "No Content" };
			setErrorState(err);
			console.log(response);
			return [false, null, err];
		}

		if (content.status != 200) {
			const err = { error: true, code: content.status, msg: content.message };
			setErrorState(err);
			console.log(content);
			return [false, content, err];
		}

		setErrorState({ ...errorState, error: false });
		return [true, content, null];
	};

	const contextValue = {
		setAccessToken,
		getTicketGroupByCode,
		generateTicket,
		getCurrentTicket,
	};
	return <TicketContext.Provider value={contextValue}>{props.children}</TicketContext.Provider>;
};

export default TicketContextProvider;

export const useContextTicket = (accessToken) => {
	const ctx = React.useContext(TicketContext);
	if (typeof accessToken != "undefined") ctx.setAccessToken(accessToken);
	return ctx;
};
