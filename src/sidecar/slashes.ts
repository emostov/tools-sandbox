import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
	const api = await ApiPromise.create({
		provider: new WsProvider('wss://polkadot.elara.patract.io'),
	});
	const earliestSlashEra = await api.query.staking.earliestUnappliedSlash();
	console.log('earliestSlashEra: ', earliestSlashEra.toHuman());
	if (earliestSlashEra.isSome) {
		const slashes1 = await api.query.staking.unappliedSlashes(earliestSlashEra.unwrap().toNumber());
		console.log('slashes1.length: ', Array.isArray(slashes1) && slashes1.length);
		Array.isArray(slashes1) && slashes1.map((s) => console.log(s.toHuman()));
	}


	const slashes2 = await api.query.staking.unappliedSlashes(357);
	console.log('slashes2.length: ', slashes2.length);
	slashes2.map((s) => console.log(s.toHuman()));
	process.exit()
}
main().catch(console.error).finally(console.log);