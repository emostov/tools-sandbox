import { ApiPromise, WsProvider } from '@polkadot/api';
import fs from 'fs';

async function main() {
	const provider = new WsProvider('wss://westend-rpc.polkadot.io');
	const api = await ApiPromise.create({ provider });
	const hash = await api.rpc.chain.getBlockHash(10000);
	const m = await api.rpc.state.getMetadata(hash);
	fs.writeFileSync('./crowdloanMetadata', m.toHex());
	api.derive.chain.getBlock

	process.exit()
}

main().catch(console.log);
