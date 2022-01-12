import { ApiPromise, WsProvider } from '@polkadot/api';
import BN from 'bn.js';
import { Vec, StorageKey } from '@polkadot/types';
import {
	AccountId,
	AccountData,
	AccountInfo,
	// Balance,
	BalanceLock,
	// BlockHash,
	// Index,
} from '@polkadot/types/interfaces';

// KNOWN BAD QUANTITIES
const ADDRESS = "EDNEfKXHd645DPpBhLZjaEwp4sPhj4STjjS4QrMbFU1FqbZ";
const BLOCK_NUMBER = 10914176;

async function main() {
	const provider = new WsProvider('wss://polkadot.api.onfinality.io/public-ws');
	const api = await ApiPromise.create({ provider });

	// get the current block number
	// const blockHash = await api.rpc.chain.getBlockHash(BLOCK_NUMBER);
	const blockHash = await api.rpc.chain.getBlockHash();

	const voters = (await api.query.phragmenElection.voting.keys()) as StorageKey<[AccountId]>[];

	console.log("Voting::count() =", voters.length);

	for (const v of voters) {
		let address = v.toHuman()[0];

		const balanceLocks
			= (await api.query.balances.locks.at(blockHash, address)) as Vec<BalanceLock>;

		const phragLock = balanceLocks.find((lock) => lock.id.toHuman() == "phrelect");

		if (phragLock !== undefined) {

			const accountData = (await api.query.system.account(address)) as AccountInfo;
			const freeBalance = accountData.data.free;

			if (freeBalance.lt(phragLock.amount)) {
				console.log("Detected over-locked voter: ", address)
			} else {
				// console.log("VALID: ", v.toHuman());
			}
		}
	}

	console.log("Script done");
}

main().catch(console.error).finally(() => process.exit());
