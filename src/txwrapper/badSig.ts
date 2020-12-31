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

	const txInfo = methods.balances.transfer(
		{
			dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', // Bob
			value: 1000000000,
		},
		{
			address: keypair.address,
			// Making sure all the polkadot-js types are converted to JS primitives
			blockHash: blockHash.toHex(),
			blockNumber: blockNumber.unwrap().toNumber(),
			genesisHash: genesisHash.toHex(),
			metadataRpc: metadataRpc,
			nonce: 1,
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

	const signingPayload = createSigningPayload(txInfo, {
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

	const signedTx = createSignedTx(txInfo, signature, {
		metadataRpc,
		registry,
	});
	// You will see an error saying: "REGISTRY: Error: findMetaCall: ...", but that is
	// just a side effect of decode trying to determine the payload type so no need to worry
	const decodedSignedTx = decode(signedTx, { metadataRpc, registry });
	console.log('Decoded signed tx: ', JSON.stringify(decodedSignedTx.method));
	console.log('signedTx: ' + signedTx);
}

main().catch((e) => {
	console.log(e);
	process.exit();
});
