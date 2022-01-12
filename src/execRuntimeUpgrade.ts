// Import the API & Provider and some utility functions
import { ApiPromise, WsProvider } from '@polkadot/api';

// import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
import { createTestKeyring } from '@polkadot/keyring/testing';

import  fs from 'fs';

async function main() {
	// Initialise the provider to connect to the local node
	const provider = new WsProvider('ws://127.0.0.1:9944');

	// Create the API and wait until ready (optional provider passed through)
	const api = await ApiPromise.create({ provider });

	// Retrieve the upgrade key from the chain state
	const adminId = await api.query.sudo.key();

	// Find the actual keypair in the keyring (if this is a changed value, the key
	// needs to be added to the keyring before - this assumes we have defaults, i.e.
	// Alice as the key - and this already exists on the test keyring)
	const keyring = createTestKeyring();
	const adminPair = keyring.getPair(adminId.toString());

	// Retrieve the runtime to upgrade
	const code = fs.readFileSync('/Users/zeke/Documents/parity/tools-sandbox/src/westend_runtime.wasm').toString('hex');
	fs.writeFileSync('./wasm-blob-hex.txt', `0x${code}`);


	// const proposal = api.tx.system && api.tx.system.setCode
	// 	? api.tx.system.setCode(`0x${code}`) // For newer versions of Substrate
	// 	: api.tx.consensus.setCode(`0x${code}`); // For previous versions

	// console.log(`Upgrading from ${adminId}, ${code.length / 2} bytes`);

	// // Perform the actual chain upgrade via the sudo module
	// api.tx.sudo
	// 	.sudo(proposal)
	// 	.signAndSend(adminPair, ({ events, status }) => {
	// 		console.log('Proposal status:', status.type);

	// 		if (status.isInBlock) {
	// 			console.error('You have just upgraded your chain');

	// 			console.log('Included at block hash', status.asInBlock.toHex());
	// 			console.log('Events:');

	// 			console.log(JSON.stringify(events, null, 2));
	// 		} else if (status.isFinalized) {
	// 			console.log('Finalized block hash', status.asFinalized.toHex());

				process.exit(0);
	// 		}
	// 	});
}

main().catch((error) => {
	console.error(error);
	process.exit(-1);
});