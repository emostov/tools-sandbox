import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const provider = new WsProvider('wss://rpc.polkadot.io');
	const api = await ApiPromise.create({ provider });

	const hashBlock3337808 = await api.rpc.chain.getBlockHash(3337808);
	const { block: block3337808 } = await api.rpc.chain.getBlock(
		hashBlock3337808
	);

	// console.log(block3337808.toHuman());
}

main().catch(console.log);
