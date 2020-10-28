import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
	const provider = new WsProvider('wss://rpc.polkadot.io');
	const api = await ApiPromise.create({ provider });

	// erasStakersKeys: Array<[key1: StorageKey, key2: StorageKey]>
	const erasValidatorPrefs = await api.query.staking.erasValidatorPrefs.keysPaged(
		{ pageSize: 3 }
	);
	erasValidatorPrefs.forEach((k) => console.log(k.toHuman()));

	// erasStakersEntries: Array<Array<[key1: StorageKey, key2: StorageKey], Codec>
	const erasValidatorPrefsEntries = await api.query.staking.erasValidatorPrefs.entriesPaged(
		{ pageSize: 5 }
	);
	erasValidatorPrefsEntries.forEach((e) =>
		console.log(e.map((c) => c.toHuman()))
	);

	// Returns
	// [
	// 	['138', '1zugcag7cJVBtVRnFxv5Qftn7xKAnR6YJ9x4x3XLgGgmNnS'],
	// 	{ commission: '0.70%' }
	// ]
	// [
	// 	['138', '14bARWgpfEiURUS7sGGb54V6mvteRhYWDovcjnFMsLfxRxVV'],
	// 	{ commission: '100.00%' }
	// ]
	// [
	// 	['138', '1hJdgnAPSjfuHZFHzcorPnFvekSHihK9jdNPWHXgeuL7zaJ'],
	// 	{ commission: '5.00%' }
	// ]
	// [
	// 	['138', '15XPnFSn3CqjkCdNzdmgzwFadU9txoGizjYew3HmsXoE3J4Z'],
	// 	{ commission: '100.00%' }
	// ]
	// [
	// 	['138', '15KRBVtLZM7QRceX61nfwXJgWSHR5YEqDFPLR4susRM7rz2U'],
	// 	{ commission: '100.00%' }
	// ]
	// [
	// 	['138', '1oAzPf1r4hzF5qZV6gn8mmgNW9oCi9SWok4AABKQGUF5GQ9'],
	// 	{ commission: '100.00%' }
	// ]
	// [
	// 	['138', '1Y6WgLRtW6JxmZjSNYsJ9b6JzuF8Kdd7t9kUNiYk9SJXraW'],
	// 	{ commission: '100.00%' }
	// ]
	// [
	// 	['138', '14xKzzU1ZYDnzFj7FgdtDAYSMJNARjDc2gNw4XAFDgr4uXgp'],
	// 	{ commission: '2.00%' }
	// ]
	// [
	// 	['138', '1WG3jyNqniQMRZGQUc7QD2kVLT8hkRPGMSqAb5XYQM1UDxN'],
	// 	{ commission: '10.00%' }
	// ]
	// [
	// 	['138', '12woCF72ik4rYzm8gUagTkEBw4S1zE4rRnAk7SaiHbbV9tDy'],
	// 	{ commission: '100.00%' }
	// ]

	process.exit();
}

main().catch(console.log);
