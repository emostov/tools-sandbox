import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const api = await ApiPromise.create({
		provider: new WsProvider('wss://rpc.polkadot.io'),
	});

	const hashBlock4355787 = await api.rpc.chain.getBlockHash(4355787);
	const { block: block4355787 } = await api.rpc.chain.getBlock(hashBlock4355787);

	block4355787.extrinsics.forEach(({ method }) => {
		console.log(method.section, method.method)
	})
}

main().catch(console.log);