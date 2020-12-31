import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const provider = new WsProvider('wss://rpc.polkadot.io');
	const api = await ApiPromise.create({ provider });
	const x = await api.query.staking.nominators.entries();
	console.log(x);
}

main().catch(console.log);
