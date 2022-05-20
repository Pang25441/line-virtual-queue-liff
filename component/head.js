import NextHead from "next/head";
import React from "react";

const Head = (props) => {
	const _site_name = process.env.NEXT_PUBLIC_TITLE;
	const _title = props.title || null;
	const _meta = props.meta ? props.meta.map((value) => <meta key={value.name} name={value.name} content={value.content} />) : [];
	return (
		<NextHead>
			<title>
				{_title && _title + " - "}
				{_site_name}
			</title>
			{_meta.map((meta) => meta)}
			{props.children}
		</NextHead>
	);
};
export default Head;
