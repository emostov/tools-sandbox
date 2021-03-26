import { ApiPromise, WsProvider } from '@polkadot/api';
import { AbstractInt } from '@polkadot/types/codec/AbstractInt'

async function main() {
	const api = await ApiPromise.create({
		provider: new WsProvider('wss://rococo-rpc.polkadot.io'),
	});

	// Array<[StorageKey, FundInfo]>
	const allFunds = await api.query.crowdloan.funds.entries();
	allFunds.map(([storageKey, fund]) => {
		const paraId = (storageKey.args[0] as AbstractInt).toBn().toNumber()
		return [paraId, fund]
	});

	const polkadotAppsUIEquivalent = allFunds.map(([storageKey, fund]) => {
		return [storageKey.toHuman(), fund.toHuman()]
	});

	polkadotAppsUIEquivalent
		.map((t) => JSON.stringify(t, undefined, 2))
		.map((j) => console.log(j));
}

main().catch(console.log);