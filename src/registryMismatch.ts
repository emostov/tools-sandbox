import { ApiPromise, WsProvider } from '@polkadot/api';

// Encoded AccountInfo (taien from tracing data at block #4403377)
const accountInfoRead = '0x010500000000000000c03c2b68430c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

// async function main() {
// 	const provider = new WsProvider('wss://polkadot.api.onfinality.io/public-ws');
// 	const api = await ApiPromise.create({ provider });

// 	const blockHash4403377 = await api.rpc.chain.getBlockHash(4403377);

// 	const block4403377 = await api.rpc.chain.getBlock(blockHash4403377);
// 	const blockRegistryAccountInfo = block4403377.registry.createType('AccountInfo', accountInfoRead);

// 	const header403377 = await api.rpc.chain.getHeader(blockHash4403377);
// 	const headerRegistryAccountInfo = header403377.registry.createType('AccountInfo', accountInfoRead);

// 	// Below I try to demonstrate that the Registries of the returned objects are not equivalent.
// 	// I think the type registry on the block is the correctly dated, but it looks like the header
// 	// just uses the latest registry.

// 	console.log(
// 		// The same account info created with the different registries are not equal (at least when converted to a string).
// 		'Both registries create the same struct: ',
// 		headerRegistryAccountInfo.toString() === blockRegistryAccountInfo.toString()
// 	);

// 	console.log('AccountInfo created with state_getBlock registry', blockRegistryAccountInfo.toString())

// 	// The type created with header includes the new `sufficients` field and assigns the `free`
// 	// `balance` to that field
// 	console.log('AccountInfo created with the state_getHeader registry', headerRegistryAccountInfo.toString());
// }


async function main() {
	const provider = new WsProvider('wss://polkadot.api.onfinality.io/public-ws');
	const api = await ApiPromise.create({ provider });
	const pres = await api.query.staking.erasValidatorPrefs(344, '126RwaHn4MDekLWfUYfiqcVbiQHapwDSAT9vZZS15HLqfDJh');
	console.log(pres.commission.unwrap().toString(10))

	// const blockHash4403377 = await api.rpc.chain.getBlockHash(4403377);

	// const block4403377 = await api.rpc.chain.getBlock(blockHash4403377);
	// const blockRegistryAccountInfo = block4403377.registry.createType('AccountInfo', accountInfoRead);

	// const events = await api.query.system.events.at(blockHash4403377)
	// const eventRegistryAccountInfo = events.registry.createType('AccountInfo', accountInfoRead);
	// console.log(
	// 	// The same account info created with the different registries are not equal (at least when converted to a string).
	// 	'Both registries create the same struct: ',
	// 	eventRegistryAccountInfo.toString() === blockRegistryAccountInfo.toString()
	// );

	// console.log('AccountInfo created with rpc.chain.getBlock registry', blockRegistryAccountInfo.toString())
	// console.log('AccountInfo created with the events registry        ', eventRegistryAccountInfo.toString());
}

main().catch(console.error).finally(() => process.exit());
