import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import BN from 'bn.js';

async function main() {
	const wsProvider = new WsProvider('ws://127.0.0.1:9944');
	// https://polkadot.js.org/docs/api/start/create#api-instance
	const api = await ApiPromise.create({ provider: wsProvider });

	const keyring = new Keyring();
	// You can change this to use the seed for your sending account
	// https://polkadot.js.org/docs/api/start/keyring#adding-accounts
	const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'sr25519');

	// The amount Alice wants to send
	const amountToSend = new BN('10000000000000000');
	// Here we see this amount is too big and will overflow JS number
	console.log(
		'Amount to send is greater than MAX_SAFE_INTEGER: ',
		amountToSend.gtn(Number.MAX_SAFE_INTEGER)
	);

	// We check if Alice has enough funds to send the amount
	const accountInfo = await api.query.system.account(alice.address);
	const { free: aliceFreeBalance } = accountInfo.data;
	console.log('Alice has a free balance of: ', aliceFreeBalance.toString(10));
	console.log('Alice wants to send: ', amountToSend.toString(10));
	console.log(
		"Alice's free balance is greater than the amount she wants to send: ",
		aliceFreeBalance.gt(amountToSend)
	);

	const toArray = [
		{
			address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', // Bob (with 42 ss58 prefix)
			amount: amountToSend,
		},
	];

	// https://polkadot.js.org/docs/api/cookbook/tx#how-can-i-batch-transactions
	const callArr = toArray.map((toInfo) => {
		const { amount, address: toAddress } = toInfo;
		const transfer = api.tx.balances.transfer(toAddress, amount);

		return transfer;
	});

	const batch = api.tx.utility.batch(callArr);
	console.log('Proposal hash: ' + batch.method.hash.toHex());

	const actualHash = (await batch.signAndSend(alice)).toHex();
	console.log('Transfer sent with hash', actualHash);
}

main().catch(console.log);
