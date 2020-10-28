import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const provider = new WsProvider('wss://rpc.polkadot.io');
	const api = new ApiPromise({ provider });
	await api.rpc.state.getRuntimeVersion();
	const call = api.findCall('0x1b03');
	console.log(call.method);
}

main().catch(console.log);
