/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as pApi from '@polkadot/api';
import * as util from '@polkadot/util';
import * as txwrapper from '@substrate/txwrapper';


async function main() {
	const provider = new pApi.WsProvider('wss://rpc.polkadot.io');
	const api = await pApi.ApiPromise.create({ provider });

	const blockHash = await api.rpc.chain.getBlockHash();
	const { block: { header } } = await api.rpc.chain.getBlock(blockHash);
	const genesisHash = await api.rpc.chain.getBlockHash(0);
	// Use hex string for metadataRPC
	const metadataRpc = (await api.rpc.state.getMetadata()).toHex();
	const { specVersion, transactionVersion } = await api.rpc.state.getRuntimeVersion();
	const keyring = new pApi.Keyring({ ss58Format: 42, type: 'sr25519' });
	const alice = keyring.createFromUri('//Alice', { name: 'Alice' });
	const destBob = keyring.createFromUri('//Bob', { name: 'Bob' });

	// You need to use getRegistry to create the registry in order to ensure you
	// have the correct types for the chain and specific runtime.
	const registry = txwrapper.getRegistry(
		'Polkadot',
		'polkadot',
		specVersion.toNumber(),
		metadataRpc
	);

	const unsigned = txwrapper.methods.balances.transferKeepAlive(
		{
			dest: destBob.address,
			value: '1234567890'
		},
		{
			address: alice.address,
			// Coonvert everything to string or numbers
			blockHash: blockHash.toHex(),
			blockNumber: header.number.unwrap().toNumber(),
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

	const extrinsicPayload = registry.createType(
		'ExtrinsicPayload',
		unsigned,
		{
			version: unsigned.version,
		}
	);
	const extrinsicPayloadU8a = extrinsicPayload.toU8a({ method: true });
	// `SignedPayloads` bigger than 256 bits get hashed with blake2_256
	// ref: https://substrate.dev/rustdocs/v3.0.0/src/sp_runtime/generic/unchecked_extrinsic.rs.html#201-209
	const signingPayloadU8a = extrinsicPayloadU8a.length > 256
		? registry.hash(extrinsicPayloadU8a)
		: extrinsicPayloadU8a;

	const signingPayload = util.u8aToHex(signingPayloadU8a);

	// It looks like the ledger sign function just signs any message by turning it into a buffer, but
	// does not do any specific formatting, so we need to format it like we do above to make sure
	// big payloads are hashed etc.
	// You might need to do something like `signingPayload.slice(2)` in order to remove the leading
	// `0x` - I am not sure what assumptions are made here:
	// https://github.com/LedgerHQ/ledgerjs/blob/a5c2ea85a37e00fc805c878bd428a20ab0c0206a/packages/hw-app-polkadot/src/Polkadot.js#L131
	console.log('Payload to sign: ', signingPayload);
	// const signature = await ledgerInstance.sign(path, signingPayload);
}

main().catch(console.log);
