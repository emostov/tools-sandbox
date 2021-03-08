import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const api = await ApiPromise.create({
		provider: new WsProvider('wss://rpc.polkadot.io'),
	});

	const hashBlock3904932 = await api.rpc.chain.getBlockHash(3904932);
	const { block: block3904932 } = await api.rpc.chain.getBlock(
		hashBlock3904932
	);

	console.log(block3904932.toHuman());
}

main().catch(console.log);
