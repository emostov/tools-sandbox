/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as api from '@polkadot/api';
import * as util from '@polkadot/util';
import * as txWrapper from '@substrate/txwrapper';
import axios from 'axios';

const url = 'http://localhost:8080';

async function main() {
	const material = (await axios.get(`${url}/transaction/material/?at=11111`))
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
	const extrinsicPayload = registry.createType(
		'ExtrinsicPayload',
		signingPayload,
		{
			version: 4,
		}
	);
	const { signature } = extrinsicPayload.sign(alice);

	// the actual payload that was signed is different from `ExtrinsincPayload.toU8a` because it does
	// not have the length of the `method` property included. As it mentions in the comment
	// above `ExtrinsincPayload.sign`, this means this data as signed is undecodable
	const actualPayloadThatWasSigned = extrinsicPayload.toU8a({ method: true });

	// slice out the type prefix that gets concatenated when signing (see links 1 & 2)
	const signatureWithTypePrefixRemoved = util.hexToU8a(signature).slice(1);

	console.log(alice.verify(actualPayloadThatWasSigned));
}

main().catch(console.log);

/**
 * Links:
 * 1) Type prefix concatenation in key pair signing: https://github.com/polkadot-js/common/blob/master/packages/keyring/src/pair/index.ts#L171
 * 2) Option passed to use type prefix when signing extrinsic payload (see withType) and you can see the actuall payload that was signed: https://github.com/polkadot-js/api/blob/master/packages/types/src/extrinsic/v4/ExtrinsicPayload.ts#L93
 *
 */
