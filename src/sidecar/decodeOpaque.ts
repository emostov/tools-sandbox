// import { ApiPromise, WsProvider } from '@polkadot/api';
// import { Struct } from '@polkadot/types';
// import { Block } from '@polkadot/types/interfaces';

// async function main() {
// 	const provider = new WsProvider('wss://rpc.polkadot.io');
// 	const api = new ApiPromise({ provider });
// 	await api.rpc.state.getRuntimeVersion();

// 	const hashBlock2106024 = await api.rpc.chain.getBlockHash(2106024);
// 	const { block: block2106024 } = await api.rpc.chain.getBlock(
// 		hashBlock2106024
// 	);
// 	// https://polkascan.io/polkadot/transaction/0x2127f7c1d119aed55d32893442d80abdb055b39966e5ee2a25b28a089b982b59
// 	console.log('Block 2106024:');
// 	// Works (balances.transfer_keep_alive)
// 	decodeOpaqueCall(block2106024, api);

// 	const hashBlock2104065 = await api.rpc.chain.getBlockHash(2104065);
// 	const { block: block2104065 } = await api.rpc.chain.getBlock(
// 		hashBlock2104065
// 	);
// 	// https://polkascan.io/polkadot/transaction/0x93b3013da76ddd94a54fb2fc53ec99e0d6e92c702e02edc80cb7355dad6c2498
// 	console.log('Block 2104065');
// 	// Works (proxy.proxy)
// 	decodeOpaqueCall(block2104065, api);

// 	const hashBlock871651 = await api.rpc.chain.getBlockHash(871651);
// 	const { block: block871651 } = await api.rpc.chain.getBlock(
// 		hashBlock871651
// 	);
// 	// https://polkascan.io/polkadot/transaction/0xf5f743643c3d2f88d976087beb630ec1794697aef684e70d389e6dd5d2f6adc8
// 	console.log('Block 871651:');
// 	// Does not work (utility.batch)
// 	decodeOpaqueCall(block871651, api);

// 	const hashBlock860023 = await api.rpc.chain.getBlockHash(860023);
// 	const { block: block860023 } = await api.rpc.chain.getBlock(
// 		hashBlock860023
// 	);
// 	// https://polkascan.io/polkadot/transaction/0x9fd043a8af67e3d01429d91ea2c1d882766bdfcca9fdd0fa598a8d7a19ffbf8d
// 	console.log('Block 860023:');
// 	// Does not work (utility.batch)
// 	decodeOpaqueCall(block860023, api);

// 	const hashBlock860406 = await api.rpc.chain.getBlockHash(860406);
// 	const { block: block860406 } = await api.rpc.chain.getBlock(
// 		hashBlock860406
// 	);
// 	// https://polkascan.io/polkadot/transaction/0x43775ad4d76364112ae992376a1069f97bcdebc253c5994efc46bee18dbadc20
// 	console.log('Block 860406:');
// 	// Does not work (utility.batch)
// 	decodeOpaqueCall(block860406, api);

// 	process.exit();
// }

// function decodeOpaqueCall(block: Block, api: ApiPromise): void {
// 	for (const ext of block.extrinsics) {
// 		// Find the asMulti transaction
// 		if (ext.method.methodName !== 'asMulti') continue;
// 		const callArgs = ext.method.get('args') as Struct;
// 		for (const paramName of callArgs.defKeys) {
// 			// Get the 'call' argument, which is an opqaque call
// 			if (paramName !== 'call') continue;
// 			const opaqueCall = callArgs.get(paramName);
// 			// try {
// 			// Try and create a polkadot-js call from the encoded call
// 			const decoded = block.registry.createType('Call', opaqueCall);
// 			console.log(decoded.toHuman());
// 			// } catch {
// 			// 	// If createType fails log a message
// 			// 	console.log('Failed to create call from OpaqueCall');
// 			// }
// 		}
// 	}

// 	console.log('\n');
// }

// main().catch(console.log);
