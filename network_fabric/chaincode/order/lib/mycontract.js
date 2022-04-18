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

function getOrderno(_date) {
    const date = _date
    var Y = date.getFullYear()
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) 
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes())
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds())
    return Y+M+D+h+m+s;
}

function getFormateTime(_date){
    const date = _date
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
}

class Order extends Contract {

    async hello(ctx){
        return "hello world"
    }

    async addOrder(ctx, houseid, arg) {
        const time = ctx.stub.getDateTimestamp()
        const orderno = getOrderno(time)

        const order = {
            orderno: orderno,
            timestamp: getFormateTime(time),
            trx: ctx.stub.getTxID(),
            houseid: houseid,
            liver: arg,
            status: '待付款'
        };
        await ctx.stub.putState(orderno, Buffer.from(stringify(sortKeysRecursive(order))));
        return JSON.stringify(order);
    }

    async getOrder(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    async deleteOrder(ctx, id) {
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
    async getAllorder(ctx) {
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
