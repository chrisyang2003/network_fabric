
'use strict';

const { Contract } = require('fabric-contract-api');

class mycontract extends Contract {

    async hello(ctx) {
        return "hello world"       
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
        return arg
    }
}



module.exports = mycontract;
