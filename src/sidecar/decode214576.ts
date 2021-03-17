import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const api = await ApiPromise.create({
		provider: new WsProvider('wss://rpc.polkadot.io'),
		types:  {
			ProxyType: {
				_enum: {
					Any: 0,
					NonTransfer: 1,
					Governance: 2,
					Staking: 3,
					SudoBalances: 4,
					IdentityJudgement: 5,
					CancelProxy: 6
				}
			}
		}
	});

	// Block from runtime 7 when sudo proxy was enabled
	const hashBlock214576 = await api.rpc.chain.getBlockHash(214576);
	const { block: block214576 } = await api.rpc.chain.getBlock(
		hashBlock214576
	);

	console.log(block214576.toHuman());

	// Block from runtime 28 when sudo proxy is disabled
	const hashBlock4101428 = await api.rpc.chain.getBlockHash(4101428);
	const { block: block4101428 } = await api.rpc.chain.getBlock(
		hashBlock4101428
	);

	console.log(block4101428.toHuman());
}

main().catch(console.log);