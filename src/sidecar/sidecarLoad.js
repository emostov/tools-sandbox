const Promise = require('bluebird');
const fetch = require('node-fetch');

async function main() {
	// Generate array from 2004125 to 2005124
	const range = Array.from(new Array(1000), (x, i) => i + 2004125);

	await Promise.map(range, async (blockHeight) => {
		const block = await get(`blocks/${blockHeight}`);
		console.log(block.number);
	}, { concurrency: 1000 }); // Try to increase this number if you don't see the error log after a while
}

async function get(path) {
	const url = 'http://localhost:8080';
	const res = await fetch(`${url}/${path}`);
	return res.json();
}

main().catch(console.log);