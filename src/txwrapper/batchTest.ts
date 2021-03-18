import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import {
	createSignedTx,
	decode,
	getRegistry,
	methods,
} from '@substrate/txwrapper';
import { u8aToHex } from '@polkadot/util'

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
	const Alice = keyring.createFromUri('//Alice', { name: 'Alice' });

	console.log('Senders address: ', Alice.address);

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
	];

	const batchCalls = transferArgs.map((args) => {
		const txInfo = methods.balances.transfer(
			args,
			{
				address: Alice.address,
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
			address: Alice.address,
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

	const extrinsicPayload = registry.createType(
		'ExtrinsicPayload',
		batch,
		{
			version: 4,
		}
	);
	const extrinsicPayloadU8a = extrinsicPayload.toU8a({ method: true });
	// `SignedPayloads` bigger than 256 bits get hashed with blake2_256
	// ref: https://substrate.dev/rustdocs/v3.0.0/src/sp_runtime/generic/unchecked_extrinsic.rs.html#201-209
	console.log(`This is a big signing payload that needs to be hashed: ${extrinsicPayloadU8a.length > 256}`)
	const signingPayload = extrinsicPayloadU8a.length > 256 ? registry.hash(extrinsicPayloadU8a) : extrinsicPayloadU8a;
	const u8aSignature = Alice.sign(signingPayload, { withType: true });
	const hexSignature = u8aToHex(u8aSignature);


	const signedTx = createSignedTx(batch, hexSignature, {
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
