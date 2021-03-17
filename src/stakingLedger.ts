import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const provider = new WsProvider('wss://rpc.polkadot.io');
	const api = await ApiPromise.create({ provider });
	const block = await api.rpc.chain.getBlockHash(789629)
	const x = await api.query.staking.bonded.at(block,
		'1zugcapKRuHy2C1PceJxTvXWiq6FHEDm2xa5XSU7KYP3rJE'
	);
	console.log(x.toJSON());
	const nom = await api.query.staking.payee('1zugcapKRuHy2C1PceJxTvXWiq6FHEDm2xa5XSU7KYP3rJE');
	console.log(nom.toJSON());
}

main().catch(console.log);
