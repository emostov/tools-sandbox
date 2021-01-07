import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const provider = new WsProvider('wss://rpc.polkadot.io');
	const api = await ApiPromise.create({ provider });
	// const x = await api.query.staking.nominators.entries();
	const x = await api.rpc.system.accountNextIndex(
		'15YVfxAkATndVv35pYj3dSUeqXHVPMSZ2g79JaPR4WWTEhPF'
	);
	console.log(x.toHuman());
}

main().catch(console.log);
