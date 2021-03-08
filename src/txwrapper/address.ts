import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';

async function main(): Promise<void> {
	await cryptoWaitReady();
	const m =
		'fringe history shy cupboard orbit supreme skin ladder soup shallow unaware wasp';
	const keyring1 = new Keyring({ ss58Format: 42, type: 'sr25519' });
	const keypair1 = keyring1.addFromUri(m);
	console.log(keypair1.address);

	const keyring2 = new Keyring({ ss58Format: 42, type: 'ed25519' });
	const keypair2 = keyring2.addFromUri(m);
	console.log(keypair2.address);
}

main().catch(console.log);
