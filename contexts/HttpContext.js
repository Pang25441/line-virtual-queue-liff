import React from "react";

export const HttpContext = React.createContext({
	endpoint: "",
	endpointBase: "",
	accessToken: "",
	setAccessToken: (accessToken) => {},
	get: async (uri) => {},
	post: async (uri, body) => {},
	put: async (uri, body) => {},
	delete: async (uri) => {},
	getBase: async (uri) => {},
});

const FETCH_OPTION = { method: "get", mode: "cors", credentials: "include" };
const HTTP_HEADER = { Accept: "application/json", "Content-Type": "application/json" };

const HttpContextProvider = (props) => {
	const [accessToken, setAccessToken] = React.useState("");
	const [httpHeader, setHttpHeader] = React.useState(HTTP_HEADER);
	const [CONFIG, setConfig] = React.useState({ ...FETCH_OPTION, headers: HTTP_HEADER });

	const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
	const endpointBase = process.env.NEXT_PUBLIC_API_BASE;

	React.useEffect(() => {
		// Set Authorization
		setHttpHeader((prevState) => {
			if (accessToken) {
				return { ...prevState, Authorization: "Bearer " + accessToken };
			} else {
				return HTTP_HEADER;
			}
		});
	}, [accessToken]);

	React.useEffect(() => {
		// Set Config
		setConfig((prevState) => {
			return { ...prevState, headers: httpHeader };
		});
	}, [httpHeader]);

	const getRequest = async (uri) => {
		try {
			const response = await fetch(endpoint + uri, CONFIG);
			return response;
		} catch (error) {
			return error;
		}
	};
	const postRequest = async (uri, body) => {
		try {
			const data = body ? body : {};
			const response = await fetch(endpoint + uri, data, { ...CONFIG, method: "post", body: JSON.stringify(data) });
			return response;
		} catch (error) {
			return error;
		}
	};
	const putRequest = async (uri, body) => {
		try {
			const data = body ? body : {};
			const response = await fetch(endpoint + uri, data, { ...CONFIG, method: "put", body: JSON.stringify(data) });
			return response;
		} catch (error) {
			return error;
		}
	};
	const deleleRequest = async (uri) => {
		try {
			const response = await fetch(endpoint + uri, { ...CONFIG, method: "delete" });
			return response;
		} catch (error) {
			return error;
		}
	};

	const getBaseRequest = async (uri) => {
		try {
			const response = await fetch(endpointBase + uri, CONFIG);
			return response;
		} catch (error) {
			return error;
		}
	};

	const contextValue = {
		endpoint,
		endpointBase,
		accessToken,
		setAccessToken,
		get: getRequest,
		post: postRequest,
		put: putRequest,
		delete: deleleRequest,
		getBase: getBaseRequest,
	};
	return <HttpContext.Provider value={contextValue}>{props.children}</HttpContext.Provider>;
};

export default HttpContextProvider;

export const useContextHttp = (accessToken) => {
	const context = React.useContext(HttpContext);
	if (typeof accessToken != "undefined") context.setAccessToken(accessToken);
	return context;
};
