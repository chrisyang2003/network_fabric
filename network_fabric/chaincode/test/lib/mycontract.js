
'use strict';

const { Contract } = require('fabric-contract-api');

class mycontract extends Contract {

    async hello(ctx) {
        return "hello world";
    }

    async info(ctx, arg){
        return {
            "返回交易提案中指定的交易ID":ctx.stub.getTxID(),
            "返回交易提案中指定的通道ID":ctx.stub.getChannelID(),
            "交易创建的时间戳": ctx.stub.getDateTimestamp(),
            "typeof 时间戳": typeof ctx.stub.getDateTimestamp(),
            "返回交易的绑定信息，如一些临时信息，以避免重复性攻击":ctx.stub.getBinding(),
            "getTransient()":ctx.stub.getTransient(),
            "getArgs": ctx.stub.getArgs(),
            "typeof getArgs": typeof ctx.stub.getArgs(),
            "arg": arg,
            "typeof arg": typeof arg,
            // "返回与交易提案相关的签名身份信息":ctx.stub.getSignedProposal(),
            // "返回该交易提交者的身份信息":ctx.stub.getCreator(),
        }
    }

    async addOrder(ctx, id, arg) {
        await ctx.stub.putState(id, Buffer.from(arg));
        return arg;
    }

    async test(ctx, name ,arg){
        return await ctx.stub.invokeChaincode(name, Array.from(arg));
    }
    async getALlStatus(ctx){
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
            console.log(result.value.key);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}



module.exports = mycontract;
