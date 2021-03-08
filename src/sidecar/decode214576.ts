import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const api = await ApiPromise.create({
		provider: new WsProvider('wss://rpc.polkadot.io'),
	});

	const hashBlock214576 = await api.rpc.chain.getBlockHash(214576);
	const { block: block214576 } = await api.rpc.chain.getBlock(
		hashBlock214576
	);

	console.log(block214576.toHuman());
}

main().catch(console.log);