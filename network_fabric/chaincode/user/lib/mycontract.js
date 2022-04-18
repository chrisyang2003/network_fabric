/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

function getUserid(_date, trx) {
    // 通过时间和交易哈希生成用户id
    const date = _date
    var Y = date.getFullYear()
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) 
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes())
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds())
    return Y+M+D+h+m+s + trx.slice(0,6);
}

class Order extends Contract {

    async hello(ctx){
        return "hello world"
    }

    async adduser(ctx, name, verify) {
        const time = ctx.stub.getDateTimestamp()
        const trx = ctx.stub.getTxID()
        const id = getUserid(time, trx)

        const user = {
            id: id,
            name: name,
            verify: verify,
            trx: trx,
            timestamp: getFormateTime(time),
        };

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(user))));
        return JSON.stringify(user);
    }

    async getUser(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    async deleteUser(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }


    // GetAllAssets returns all assets found in the world state.
    async getAllUser(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
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

module.exports = Order;
