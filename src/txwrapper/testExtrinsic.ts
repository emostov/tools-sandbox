import { ApiPromise, WsProvider } from '@polkadot/api';

async function main(): Promise<void> {
	const api = new ApiPromise({
		provider: new WsProvider('wss://rpc.polkadot.io'),
	});

	const version = await api.rpc.state.getRuntimeVersion();
	console.log(version.toHuman());

	const ext = api.createType(
		'Extrinsic',
		'0x390284de11bef8cb54a7787af6ae41a68e1cbffe8a5849c40b5a4585e6089215a8a24801d6198388588126468fdbc2facb045cdc9f36a5a41fd4a9cfd4242c8d89ae274e96111654d2d15883483ae3854d9b919786b23164bd669c3239e05d2f41ac438e009101000500bce3f7344d9037f8e4c6484d9198c1411ff4b418a7cc9edc3c4298d9c254256e0700c817a804'
	);

	console.log(ext.toHuman());
}

main().catch(console.log);
