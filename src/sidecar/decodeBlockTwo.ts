import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const api = await ApiPromise.create({
		provider: new WsProvider('wss://rpc.polkadot.io'),
	});

	const hashBlock2 = await api.rpc.chain.getBlockHash(2);
	const { block: block2 } = await api.rpc.chain.getBlock(hashBlock2);

	// Pull out parachains::set_heads; call index [20, 0]
	const { method } = block2.extrinsics[1];
	console.log(method.toString()); // { "callIndex": "0x1400", "args": { "heads": [] } }

	const call = hashBlock2.registry.createType('Call', method);

	console.log(call.toHuman());
}

main().catch(console.log);
