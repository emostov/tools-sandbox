import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const provider = new WsProvider('wss://rpc.polkadot.io');
	const api = await ApiPromise.create({ provider });
	const blockHash = await api.rpc.chain.getBlockHash(1000);
	await api.query.staking.erasRewardPoints.at(blockHash, 0);
	const rewardPoints = await api.query.staking.erasRewardPoints.at(
		blockHash, // Historic block height where: ActiveEra - History Depth < era you are looking for
		0 // EraIndex
	);
	console.log(rewardPoints.toHuman());
}

main().catch(console.log);
