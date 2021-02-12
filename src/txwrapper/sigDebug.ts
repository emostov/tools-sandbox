import { ApiPromise, WsProvider } from '@polkadot/api';
import * as util from '@polkadot/util';
import * as crypto from '@polkadot/util-crypto'
import {
	getRegistry,
} from '@substrate/txwrapper';

async function main() {
	const provider = new WsProvider('wss://cc1-1.polkadot.network');
	const api = await ApiPromise.create({ provider: provider });

	const _blockInfo = await api.rpc.chain.getBlock();
	const genesisHash = api.genesisHash;
	const metadataRpc = api.runtimeMetadata.toHex();
	const specVersionInfo = api.runtimeVersion;
	const specVersion = specVersionInfo.specVersion;
	const transactionVersion = specVersionInfo.transactionVersion;

	// const tx =
	// 	'0x3D0284C8F60EF75C06E2631FB31F761D92194671488B7740FCE405F3A185425CB07391006A5FBA742C6677D10B996139BF7FFBCCA8431265D94E2183D235FA10ADFB9B047EDC5C3A9DD2FE1BD8281AEEAAE90F73A45F02E61479E9FA1AD03FE5FFEFEE0900F501000500C9A668459A03149830B3A3FF4EE7201CC8F5F265D50A411A8AAF7F5B1DCC7AAE0B00E0B1500707';
	// let ref =  registry.createType('Extrinsic', hexToU8a(tx), {
	// 	isSigned: true,
	// });

	// results in: { 
	// 	"signature": 
	// 		{
	// 			"signer": "15YVfxAkATndVv35pYj3dSUeqXHVPMSZ2g79JaPR4WWTEhPF",
	// 			"signature": {
	// 				"Ed25519":
	// 					"0x6a5fba742c6677d10b996139bf7ffbcca8431265d94e2183d235fa10adfb9b047edc5c3a9dd2fe1bd8281aeeaae90f73a45f02e61479e9fa1ad03fe5ffefee09" 
	// 			},
	// 			"era": { "ImmortalEra": "0x00" }, 
	// 			"nonce": 125, 
	// 			"tip": 0 
	// 		}, 
	// 	"method": { 
	// 		"callIndex": "0x0500", 
	// 		"args": { 
	// 			"dest": "15ZQ4NXTXZKbWVUjJJnAav443YxjUeQsRqmLEw3RQLURqM2R", 
	// 			"value": 7728000000000 
	// 		} 
	// 	} 
	// }


	const registry = getRegistry(
		'Polkadot',
		'polkadot',
		specVersion.toNumber(),
		metadataRpc
	);

	// The payload that gets signed
	const sigPayload = registry.createType('ExtrinsicPayload', {
		blockHash: genesisHash,
		era: registry.createType('ExtrinsicEra', null),
		genesisHash: genesisHash,
		method: registry.createType('Call', {
			callIndex: [5, 0],
			args: {
				dest: '15ZQ4NXTXZKbWVUjJJnAav443YxjUeQsRqmLEw3RQLURqM2R',
				value: 7728000000000,
			},
		}),
		nonce: 125,
		specVersion,
		tip: 0,
		transactionVersion,
	});

	const signature = "0x6a5fba742c6677d10b996139bf7ffbcca8431265d94e2183d235fa10adfb9b047edc5c3a9dd2fe1bd8281aeeaae90f73a45f02e61479e9fa1ad03fe5ffefee09"

	// slice out the type prefix that gets concatenated when signing (see links 1 & 2)
	const signatureWithTypePrefixRemoved = util.hexToU8a(signature);

	let address = "15YVfxAkATndVv35pYj3dSUeqXHVPMSZ2g79JaPR4WWTEhPF";
	// publicKey has prefix + 2 checksum bytes, short only prefix + 1 checksum byte
	// let decodedAddr = crypto.base58Decode(address).slice(3)

	let res = crypto.signatureVerify(
		sigPayload.toU8a({ method: true }),
		signatureWithTypePrefixRemoved,
		address
	)

	console.log("verified: ", res);
}

main().catch(console.log);

/**
 * Links:
 * 1) Type prefix concatenation in key pair signing: https://github.com/polkadot-js/common/blob/master/packages/keyring/src/pair/index.ts#L171
 * 2) Option passed to use type prefix when signing extrinsic payload (see withType) and you can see the actuall payload that was signed: https://github.com/polkadot-js/api/blob/master/packages/types/src/extrinsic/v4/ExtrinsicPayload.ts#L93
 *
 */