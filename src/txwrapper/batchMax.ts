import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import {
	createSignedTx,
	createSigningPayload,
	decode,
	getRegistry,
	methods,
} from '@substrate/txwrapper';

async function main(): Promise<void> {
	const provider = new WsProvider('ws://127.0.0.1:9944');
	const api = await ApiPromise.create({ provider: provider });
	const blockInfo = await api.rpc.chain.getBlock();
	const blockNumber = blockInfo.block.header.number;
	const blockHash = await api.rpc.chain.getBlockHash(blockNumber.unwrap());
	const genesisHash = api.genesisHash;
	const specVersionInfo = api.runtimeVersion;
	const specVersion = specVersionInfo.specVersion;
	const transactionVersion = specVersionInfo.transactionVersion;
	const metadataRpc = api.runtimeMetadata.toHex();

	// Using 42 for the --dev chain
	const keyring = new Keyring({ ss58Format: 42, type: 'sr25519' });
	const keypair = keyring.addFromUri('//Alice', { name: 'Alice' });

	console.log('Senders address: ', keypair.address);

	const registry = getRegistry(
		'Polkadot',
		'polkadot',
		specVersion.toNumber(),
		metadataRpc
	);

	const transferArgs = [
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '1000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '2000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '3000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '4000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '5000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '6000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '7000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '8000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '9000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '11000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '12000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '13000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '14000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '15000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '16000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '17000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '18000000000',
		},
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
			value: '19000000000',
		},
	];

	const batchCalls = transferArgs.map((args) => {
		const txInfo = methods.balances.transfer(
			args,
			{
				address: keypair.address,
				// Making sure all the polkadot-js types are converted to JS primitives
				blockHash: blockHash.toHex(),
				blockNumber: blockNumber.unwrap().toNumber(),
				genesisHash: genesisHash.toHex(),
				metadataRpc: metadataRpc,
				nonce: 0,
				specVersion: specVersion.toNumber(),
				tip: 0,
				eraPeriod: 64,
				transactionVersion: transactionVersion.toNumber(),
			},
			{
				registry: registry,
				metadataRpc: metadataRpc,
			}
		);

		return txInfo.method;
	});

	const batch = methods.utility.batch(
		{
			calls: batchCalls,
		},
		{
			address: keypair.address,
			blockHash: blockHash.toHex(),
			blockNumber: blockNumber.unwrap().toNumber(),
			genesisHash: genesisHash.toHex(),
			metadataRpc: metadataRpc,
			nonce: 3,
			specVersion: specVersion.toNumber(),
			tip: 0,
			eraPeriod: 64,
			transactionVersion: transactionVersion.toNumber(),
		},
		{
			registry: registry,
			metadataRpc: metadataRpc,
		}
	);

	const signingPayload = createSigningPayload(batch, {
		registry,
	});

	const extrinsicPayload = registry.createType(
		'ExtrinsicPayload',
		signingPayload,
		{
			version: 4,
		}
	);
	const { signature } = extrinsicPayload.sign(keypair);

	const signedTx = createSignedTx(batch, signature, {
		metadataRpc,
		registry,
	});

	const decodedSignedTx = decode(signedTx, { metadataRpc, registry });
	console.log('Decoded signed tx: ', JSON.stringify(decodedSignedTx.method));
	console.log('signedTx: ' + signedTx);
}

main()
	.catch((e) => {
		console.log(e);
		process.exit();
	})
	.finally(() => process.exit());
