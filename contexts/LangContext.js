import React from "react";
import LangEn from "../languages/en/langEn";
import LangTh from "../languages/th/langTh";

export const LangContext = React.createContext({
	currentLanguage: "en",
	ticket: LangEn.LangTicket,
	setLang: (lang) => {},
});

const LangContextProvider = (props) => {
	const [currentLanguage, setCurrentLanguage] = React.useState("");
	const [ticketLang, setTicketLang] = React.useState(LangEn.LangTicket);

	const setLang = React.useCallback(
		(lang) => {
			const label = lang.toString().toLocaleLowerCase();

			let language;
			switch (label) {
				case "th":
					language = LangTh;
					break;

				case "en":
					language = LangEn;
					break;

				default:
					break;
			}

			if (language) {
				// if (currentLanguage != label) {
				// 	localStorage.setItem("language", label);
				// }
				localStorage.setItem("language", label);
				setCurrentLanguage(label);
				setTicketLang(language.LangTicket);
			}
		},
		[setCurrentLanguage]
	);

	React.useEffect(() => {
		const getSetting = async () => {
			const savedLanguage = await localStorage.getItem("language");
			if (!savedLanguage) {
				localStorage.setItem("language", "en");
			}
			const lang = savedLanguage || "en";
			setCurrentLanguage(lang);
			return lang;
		};

		getSetting().then((lang) => {
			try {
				setLang(lang);
			} catch (error) {
				setLang("en");
			}
		});
	}, [setCurrentLanguage, setLang]);

	const contextValue = {
		currentLanguage,
		ticket: ticketLang,
		setLang,
	};

	return <LangContext.Provider value={contextValue}>{props.children}</LangContext.Provider>;
};

export default LangContextProvider;

export const useContextLang = () => {
	return React.useContext(LangContext);
};
