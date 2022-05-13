'use strict';

const { Contract } = require('fabric-contract-api');


async function Exists(ctx, id) {
	const assetBuffer = await ctx.stub.getState(id);
	return assetBuffer && assetBuffer.length > 0;
}

async function readState(ctx, id) {
	const assetBuffer = await ctx.stub.getState(id);
	if (!assetBuffer || assetBuffer.length === 0) {
		throw new Error(`The asset ${id} does not exist`);
	}
	return assetBuffer.toString();
}

async function putState(ctx, id, content) {
	return ctx.stub.putState(id, Buffer.from(JSON.stringify({
		user: id,
		balance: content
	})));
}

async function initUser(ctx, user) {

	if (!(await Exists(ctx, user))) {
		await putState(ctx, user, 0);
	}
	
}

class mycontract extends Contract {

	async tokenName(ctx) {
		return 'HotelToken';
	}

	async Symbol(ctx) {
		return 'HTN';
	}

	async InitLedger(ctx) {
		await putState(ctx, 'totalSupply', 0);
	}

	async totalSupply(ctx) {
		return this.balanceOf(ctx, 'totalSupply');
	}

	async balanceOf(ctx, user) {
		const r = await readState(ctx, user);
		return parseInt(JSON.parse(r).balance);
	}

	async Mint(ctx, user, _amount) {
		// user exist check
		await initUser(ctx, user);

		const amount = parseInt(_amount);
		const newTotal = await this.totalSupply(ctx) + amount;
		const newUserBalance = await this.balanceOf(ctx, user) + amount;

		await putState(ctx, 'totalSupply', newTotal);
		await putState(ctx, user, newUserBalance);

	}

	async transfer(ctx, from, to, _amount) {
		await initUser(ctx, from);
		await initUser(ctx, to);

		const amount = parseInt(_amount);

		let fromBalance = await this.balanceOf(ctx, from);
		if (fromBalance < amount) {
			throw new Error(`User ${from} does not have enough token`);
		}

		const newFrom = await this.balanceOf(ctx, from) - amount;
		const newTo = await this.balanceOf(ctx, to) + amount;

		await putState(ctx, from, newFrom);
		await putState(ctx, to, newTo);
	}


	// GetAllAssets returns all assets found in the world state.
	async getTokenList(ctx) {
		const allResults = [];
		const iterator = await ctx.stub.getStateByRange('', '');
		let result = await iterator.next();
		while (!result.done) {
			const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
			let record;
			try {
				record = JSON.parse(strValue);
			} catch (err) {
				console.log(err);
				record = strValue;
			}
			allResults.push(record);
			result = await iterator.next();
		}
		return JSON.stringify(allResults);
	}



}

module.exports = mycontract;
