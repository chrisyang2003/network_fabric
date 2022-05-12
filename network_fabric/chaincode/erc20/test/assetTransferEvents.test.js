'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub, ClientIdentity } = require('fabric-shim');

const AssetTransfer = require('../lib/assetTransferEvents.js');

let assert = sinon.assert;
chai.use(sinonChai);

describe('Asset Transfer Events Tests', () => {
	let transactionContext, chaincodeStub, clientIdentity;

	beforeEach(() => {
		transactionContext = new Context();

		chaincodeStub = sinon.createStubInstance(ChaincodeStub);
		chaincodeStub.getMspID.returns('org1');
		transactionContext.setChaincodeStub(chaincodeStub);

		clientIdentity = sinon.createStubInstance(ClientIdentity);
		clientIdentity.getMSPID.returns('org1');
		transactionContext.clientIdentity = clientIdentity;

		chaincodeStub.putState.callsFake((key, value) => {
			if (!chaincodeStub.states) {
				chaincodeStub.states = {};
			}
			chaincodeStub.states[key] = value;
		});

		chaincodeStub.getState.callsFake(async (key) => {
			let ret;
			if (chaincodeStub.states) {
				ret = chaincodeStub.states[key];
			}
			return Promise.resolve(ret);
		});

		chaincodeStub.deleteState.callsFake(async (key) => {
			if (chaincodeStub.states) {
				delete chaincodeStub.states[key];
			}
			return Promise.resolve(key);
		});

		chaincodeStub.getStateByRange.callsFake(async () => {
			function* internalGetStateByRange() {
				if (chaincodeStub.states) {
					// Shallow copy
					const copied = Object.assign({}, chaincodeStub.states);

					for (let key in copied) {
						yield { value: copied[key] };
					}
				}
			}

			return Promise.resolve(internalGetStateByRange());
		});


	});

	describe('Test InitLedger', () => {
		it('should return success on InitLedger ', async () => {
			let assetTransfer = new AssetTransfer();
			await assetTransfer.InitLedger(transactionContext);
			let totalSupply = await assetTransfer.totalSupply(transactionContext);
			expect(totalSupply).to.eql(0);
		});
	});

	describe('Test info', () => {
		it('should return success on info ', async () => {
			let assetTransfer = new AssetTransfer();
			expect('HotelToken').to.eql((await assetTransfer.tokenName(transactionContext)));
			expect('HTN').to.eql((await assetTransfer.Symbol(transactionContext)));
		});
	});

	describe('Test mint', () => {
		it('should return success on mint user alice ', async () => {
			let assetTransfer = new AssetTransfer();
			await assetTransfer.InitLedger(transactionContext);

			await assetTransfer.Mint(transactionContext, 'alice', '10');

			expect(10).to.eql((await assetTransfer.balanceOf(transactionContext, 'alice')));
			expect(10).to.eql((await assetTransfer.totalSupply(transactionContext)));

		});
	});

	describe('Test transfer', () => {
		it('should return error on transfer alice to bob', async () => {

			// chaincodeStub.putState.rejects('User alice does not have enough token');

			let assetTransfer = new AssetTransfer();
			await assetTransfer.InitLedger(transactionContext);

			await assetTransfer.Mint(transactionContext, 'alice', '10');

			expect(10).to.eql((await assetTransfer.balanceOf(transactionContext, 'alice')));
			expect(10).to.eql((await assetTransfer.totalSupply(transactionContext)));

			try {
				await assetTransfer.transfer(transactionContext, 'alice', 'bob', '11');
				assert.fail('transfer should have failed');
			} catch (err) {
				expect(err.message).to.equal('User alice does not have enough token');
			}
		});

		it('should return success on transfer alice to bob', async () => {

			// chaincodeStub.putState.rejects('User alice does not have enough token');

			let assetTransfer = new AssetTransfer();
			await assetTransfer.InitLedger(transactionContext);

			await assetTransfer.Mint(transactionContext, 'alice', '10');

			expect(10).to.eql((await assetTransfer.balanceOf(transactionContext, 'alice')));
			expect(10).to.eql((await assetTransfer.totalSupply(transactionContext)));

			await assetTransfer.transfer(transactionContext, 'alice', 'bob', '5');

			expect(5).to.eql((await assetTransfer.balanceOf(transactionContext, 'alice')));
			expect(5).to.eql((await assetTransfer.balanceOf(transactionContext, 'bob')));
		});

		it('should return success on tow user', async () => {

			// chaincodeStub.putState.rejects('User alice does not have enough token');

			let assetTransfer = new AssetTransfer();
			await assetTransfer.InitLedger(transactionContext);

			await assetTransfer.Mint(transactionContext, 'alice', '10');

			expect(10).to.eql((await assetTransfer.balanceOf(transactionContext, 'alice')));
			expect(10).to.eql((await assetTransfer.totalSupply(transactionContext)));

			await assetTransfer.transfer(transactionContext, 'alice', 'bob', '5');

			expect(5).to.eql((await assetTransfer.balanceOf(transactionContext, 'alice')));
			expect(5).to.eql((await assetTransfer.balanceOf(transactionContext, 'bob')));

			let exp = [
				{ user: 'totalSupply', balance: 10 },
				{ user: 'alice', balance: 5 },
				{ user: 'bob', balance: 5 }
			];
			let r = await assetTransfer.getTokenList(transactionContext);
			expect(exp).to.eql(JSON.parse(r));
		});
	});

});
