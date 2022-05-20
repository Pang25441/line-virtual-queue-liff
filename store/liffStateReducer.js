import { useReducer } from "react";

function initialState(_initialState) {
	const liff = null;
	const isInit = false;
	const initialError = false;
	const hasError = false;
	const message = null;
	const profile = null;
	const accessToken = null;
	const initialState = _initialState || { liff, isInit, initialError, message, hasError, profile, accessToken };
	return initialState;
}

function reducer(state, action) {
	switch (action.type) {
		case "INIT_OK":
			return { ...state, liff: action.liff, isInit: true, initialError: false, accessToken: action.liff.getAccessToken() };
		case "INIT_FAIL":
			return { ...state, isInit: false, initialError: true, message: action.message || "No Message" };
		case "ERROR":
			return { ...state, hasError: true, message: action.message || "No Message" };
		case "SUCCESS":
			return { ...state, hasError: false, message: action.message || "OK" };
		case "PROFILE":
			return { ...state, hasError: false, profile: action.profile };
		default:
			throw new Error();
	}
}

export default function LiffReducer(_initialState) {
	return useReducer(reducer, initialState(_initialState));
}
