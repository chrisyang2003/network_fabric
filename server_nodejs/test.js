const fabric = require('./fabric_sdk_node/gateway')
const {BlockDecoder} = require('fabric-common')
const protos = require('fabric-protos')

async function main() {
    // const network = await fabric.gateway('mychannel')
    // const contract = network.getContract('qscc');

    const network = await fabric.gateway('mychannel')
    const contract = network.getContract('a1');

    result = await contract.evaluateTransaction('getOrder', '20220418171204');
    trx = JSON.parse(result).trx
    console.log(trx);
    
    


    

    // for (let i = 0; i < 10; i++ ){
    //     var resultByte = await contract.submitTransaction('addOrder','1','{}');
    //     console.log(resultByte.toString());
    // }

    // var resultByte = await contract.evaluateTransaction('GetTransactionByID','mychannel','f5b3e20b105a16793e3fa534cd7bcee51286ccf9f40511cb7e76b2c7a29d0fb6');
    // const out = BlockDecoder.decodeTransaction(resultByte).transactionEnvelope.payload
    
    // const header = out.header.channel_header
    // console.log(header);
    
    // data = {
    //   basic: {
    //     timestamp: header.timestamp,
    //     channel_id: header.channel_id,
    //     trx: header.tx_id
    //   }
    // }
    
    // console.log(data)

    // var resultByte = await contract.evaluateTransaction('GetTransactionByID','mychannel','59d460b2d1c3ebee54032f4026b5082b045dd54b63a1cb6af966f8c922ebf0da');
    // data = BlockDecoder.decodeTransaction(resultByte)
    // var result

    // resultByte = await contract.evaluateTransaction('GetBlockByNumber','mychannel','2');
    // console.log(('queryBlock', resultByte.toString()));

    // resultByte = await contract.evaluateTransaction('GetBlockByHash','mychannel','59d460b2d1c3ebee54032f4026b5082b045dd54b63a1cb6af966f8c922ebf0da');
    // console.log(('queryBlock', resultByte.toString()));

    // resultByte = await contract.evaluateTransaction('GetTransactionByID','mychannel','59d460b2d1c3ebee54032f4026b5082b045dd54b63a1cb6af966f8c922ebf0da');
    // data = BlockDecoder.decodeTransaction(resultByte)

    // console.log(data.transactionEnvelope.payload.data);
    
    



    // resultByte = await contract.evaluateTransaction('GetChainInfo','mychannel');
    // data = protos.common.BlockchainInfo.decode(resultByte)
    // console.log(data.previousBlockHash.toString('hex'));    

    // tByte = await contract.evaluateTransaction('GetBlockByTxID','mychannel', 'd84a466547b62b387d283ff8ef829adf42bc740316d04cf4e4484ebdd1fa8f80');
    // data = protos.common.BlockchainInfo.decode(tByte)
    // console.log(protos.common.blockdeacoer.decode(data.currentBlockHash));
    

    // console.log(JSON.parse(data));
    
    
    
    
    // // console.log(util.BlockDecoder.decode(resultByte));
    // util.common.BlockchainInfo.decode(resultByte)
     
    
    
}

main()



