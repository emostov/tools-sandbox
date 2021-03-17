import { ApiPromise, WsProvider } from '@polkadot/api';
import fs from 'fs';

async function main() {
	const provider = new WsProvider('ws://127.0.0.1:9944');
	const api = await ApiPromise.create({ provider });
	const blockHash = await api.rpc.chain.getBlockHash();
	const m = await api.rpc.state.getMetadata()
	fs.writeFileSync('./crowdloanMetadata', m.toHex())
}

main().catch(console.log);
