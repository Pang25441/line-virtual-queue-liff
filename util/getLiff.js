export default async function getLiff(liffId) {
	const liff = (await import("@line/liff")).default;
	const [success, err] = await liff
		.init({ liffId, withLoginOnExternalBrowser: true })
		.then(() => {
			return [true, null];
		})
		.catch((err) => {
			return [false, err];
		});
	return [liff, success, err];
}
