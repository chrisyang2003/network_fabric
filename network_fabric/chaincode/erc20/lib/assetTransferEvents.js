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
	// @content string
	if (typeof content === 'number') {
		content = content.toString();
	}
	return ctx.stub.putState(id, Buffer.from(content));
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
		const total = await readState(ctx, 'totalSupply');
		return parseInt(total);
	}

	async balanceOf(ctx, user) {
		const balance = await readState(ctx, user);
		return parseInt(balance);
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

		const newForm = await this.balanceOf(ctx, from) - amount;
		const newTo = await this.balanceOf(ctx, to) + amount;

		await putState(ctx, from, newForm);
		await putState(ctx, to, newTo);

		// return true;

	}

}

module.exports = mycontract;
