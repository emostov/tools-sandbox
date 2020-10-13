/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as api from '@polkadot/api';
import * as util from '@polkadot/util';
import * as txwrapper from '@substrate/txwrapper';
import { metadataRpc } from '@substrate/txwrapper/lib/util';
import axios from 'axios';

const url = 'http://localhost:8080';

async function main() {
	const material = (await axios.get(`${url}/transaction/material`))
		.data as Record<string, any>;

	const keyring = new api.Keyring();
	const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'ecdsa');

	const registry = txwrapper.getRegistry(
		material.chainName,
		material.specName,
		Number(material.specVersion)
	);

	const unsigned = txwrapper.methods.balances.transfer(
		{
			value: '10000',
			dest: '5DpGPTju2gHJKo8cjWRGwzyUPKHBkGVm7d9HH6XUyn5qi1p6', // random address
		},
		{
			tip: 0,
			nonce: 2,
			address: alice.address,
			eraPeriod: 10000,
			blockNumber: Number(material.at.height),
			blockHash: material.at.hash,
			genesisHash: material.genesisHash,
			metadataRpc: material.metadata,
			specVersion: Number(material.specVersion),
			transactionVersion: Number(material.txVersion),
		},
		{
			registry,
			// The metadaRpc is used to set the metadata on the registry when this method is being executed.
			// Because of this, the registry you pass in here will now have the metadata set everytime you use it
			// after this method executes.
			// See here for how the method sets the metadata on the registry:
			// https://github.com/paritytech/txwrapper/blob/18960c95a6830653fc48e098698a8d8b15fd5808/src/util/method.ts#L60
			metadataRpc: material.metadata,
		}
	);

	const extrinsicPayload = registry
		.createType('ExtrinsicPayload', unsigned, {
			version: 4,
		})
		.toU8a({ method: true });

	// Pass in the optional 4th param to `getRegistry` so the metadataRpc will be set on the registry 
	// for you
	const anotherRegistry = txwrapper.getRegistry(
		material.chainName,
		material.specName,
		Number(material.specVersion),
		// Here, we can pass in the metadataRpc, and `getRegistry` will set it on the registry for us.
		// However, if we don't pass it in then it will not be set on the registry for us and it will need
		// to be done at some later point with `registry.setMetadata(createMetadata(registry, metadataRpc));`
		// See here for how `getRegistry` sets the metadata on the registry:
		// https://github.com/paritytech/txwrapper/blob/18960c95a6830653fc48e098698a8d8b15fd5808/src/util/metadata.ts#L125
		metadataRpc
	);
	const anotherExtrinsicPayload = anotherRegistry
		.createType('ExtrinsicPayload', unsigned, {
			version: 4,
		})
		.toU8a({ method: true });

	console.log('These payload are different:');
	console.log(
		'The two payloads are the same because they have the same metadata set on the registry: ',
		util.u8aToHex(extrinsicPayload) ==
			util.u8aToHex(anotherExtrinsicPayload)
	);
}

main().catch(console.log);
