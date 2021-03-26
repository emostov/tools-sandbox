import { ApiPromise, WsProvider } from '@polkadot/api';
import fs from 'fs';

async function main() {
	const provider = new WsProvider('ws://127.0.0.1:9944');
	const api = await ApiPromise.create({ provider });
	console.log('is ready')
	console.log(api.runtimeChain)
	const blockHash = await api.rpc.chain.getBlockHash();
	console.log('blockHash: ', blockHash);
	// const m = await api.rpc.state.getMetadata()
	// fs.writeFileSync('./crowdloanMetadata', m.toHex())
}

main().catch(console.log);
