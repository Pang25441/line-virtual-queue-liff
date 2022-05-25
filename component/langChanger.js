import { Box, Button, ButtonGroup } from "@mui/material";
import { useContextLang } from "../contexts/LangContext";

const LangChanger = (props) => {
	const lang = useContextLang();

	const handleLangChange = (_lang) => {
		lang.setLang(_lang);
	};

	return (
		<Box sx={{...props?.sx, display: "flex", justifyContent: "center" }}>
			<ButtonGroup variant="text" aria-label="text button group">
				<Button disabled={lang.currentLanguage === "en"} onClick={handleLangChange.bind(null, "en")}>
					English
				</Button>
				<Button disabled={lang.currentLanguage === "th"} onClick={handleLangChange.bind(null, "th")}>
					ไทย
				</Button>
			</ButtonGroup>
		</Box>
	);
};

export default LangChanger;
