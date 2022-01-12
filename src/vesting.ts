import { ApiPromise, WsProvider } from '@polkadot/api';
import { Vec, Option} from '@polkadot/types/codec';
import { VestingSchedule, AccountId } from '@polkadot/types/interfaces';
import { createTestKeyring } from '@polkadot/keyring/testing';


const keyring = createTestKeyring();

async function main() {
	const provider = new WsProvider('ws://127.0.0.1:9944');
	const api = await ApiPromise.create({ provider });

	// const prefix = await api.query.vesting.vesting.keyPrefix();
	// const prefix = await api.query.vesting.key();
	const vestingPrefix = api.createType('Text', 'Vesting').toHex();
	const keys = await api.rpc.state.getKeys(vestingPrefix);
		const results = await Promise.all(keys.map((k) => {
			return api.rpc.state.getStorage(k.toHex())
		}));

		results.map((bytes) => console.log((bytes as any).toHex()));


	process.exit();
}

main().catch(console.log);