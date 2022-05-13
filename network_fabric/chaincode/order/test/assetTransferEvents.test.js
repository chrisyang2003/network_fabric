'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub, ClientIdentity } = require('fabric-shim');

const AssetTransfer = require('../lib/mycontract');

// let assert = sinon.assert;
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


});
