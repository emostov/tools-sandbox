/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as api from '@polkadot/api';
import * as util from '@polkadot/util';
import * as utilCrypto from '@polkadot/util-crypto';
import * as txWrapper from '@substrate/txwrapper';
import axios from 'axios';

const url = 'http://localhost:8080';

async function main() {
	const material = (await axios.get(`${url}/transaction/material/`))
		.data as Record<string, any>;

	const keyring = new api.Keyring();
	const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'ecdsa');
	const registry = txWrapper.getRegistry(
		material.chainName,
		material.specName,
		Number(material.specVersion),
		material.metadata
	);

	const unsigned = txWrapper.methods.balances.transfer(
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
			metadataRpc: material.metadata,
		}
	);

	const signingPayload = txWrapper.createSigningPayload(unsigned, {
		registry,
	});

	console.log(signingPayload);

	const { signature } = registry
		.createType('ExtrinsicPayload', signingPayload, { version: 4 })
		.sign(alice);

	console.log(
		alice.verify(util.u8aToU8a(signingPayload), util.u8aToU8a(signature))
	);
}
