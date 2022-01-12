import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const api = await ApiPromise.create({
		provider: new WsProvider('wss://kusama.api.onfinality.io/public-ws'),
	});

	const blockHash7487667 = await api.rpc.chain.getBlockHash(7491223);
	const block7487667 = await api.rpc.chain.getBlock(blockHash7487667);

}

main().catch(console.error).finally(console.log);