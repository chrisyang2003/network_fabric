const fabric = require('./fabric_sdk_node/gateway')
const {BlockDecoder} = require('fabric-common')
const protos = require('fabric-protos')

async function main() {
    let network = await fabric.gateway('mychannel')
    let contract = network.getContract('qscc');
    let result


    contract = network.getContract('t2');

    // result = await contract.evaluateTransaction('hello')
    // console.log(result.toString());


    // let a = ['GetTransactionByID','mychannel', '8ab8f29eda6985326159b4968ddf7daf1cafe4116fc0be3341dad98848f79d2b']   
    result = await contract.evaluateTransaction('getALlStatus');
    console.log(result.toString()) ;
    // result = await contract.submitTransaction('test', JSON.stringify(a))
    // console.log(result.toString());
    return

    // result = await contract.evaluateTransaction('GetTransactionByID','mychannel','dda15f445014101ca0b04439edbffbf06763cbc5eac9393ed5e1c22549c94b11');
    // const unSerialization = BlockDecoder.decodeTransaction(result).transactionEnvelope.payload
    // console.log(unSerialization);

    
    // trx = JSON.parse(result).trx
    // console.log(trx);

    let req = {
        id: 1,
        pk: "1681604707407081035618785091256394631809994265875651677792083607031329260095430652697386864316136",
        enc_pk: "15494314275293570278787566575911155288182668514190080547171295332432042675967740982927599299219213622772002317",
        r: "1200506371138025538645650184133",
        proof: "U2FsdGVkX1/K4bAsMeual84v4VJrJOGeX4aUmKomTsSYec46VMn4cndoyYVZQr3DLk33kDrYwaFQZ4LPl7zuft2BXkOrOeo4graIS/7lKpnaS+I9ZJjPUlHwvuHXyw/T",
        ext: "U2FsdGVkX18jld+xY8R64+YG50yjSyjCWnQg9OuLlA97T/z+JfdsZvHOtxbEoMBIrXkCixjvGriuHcFmnsJLrw=="
    }

    let login = {
        pk: "1681604707407081035618785091256394631809994265875651677792083607031329260095430652697386864316136",
        proof: "U2FsdGVkX1/K4bAsMeual84v4VJrJOGeX4aUmKomTsSYec46VMn4cndoyYVZQr3DLk33kDrYwaFQZ4LPl7zuft2BXkOrOeo4graIS/7lKpnaS+I9ZJjPUlHwvuHXyw/T",
    }

    let logout = login

    let erc20mint = {
        value: 100,
    }

    let erc20tran = {
        to: "77572166726306052963124390732132528288098191008660265702778011196707064436445523",
        value: 100,
        from: "1681604707407081035618785091256394631809994265875651677792083607031329260095430652697386864316136",
        proof: "U2FsdGVkX1/K4bAsMeual84v4VJrJOGeX4aUmKomTsSYec46VMn4cndoyYVZQr3DLk33kDrYwaFQZ4LPl7zuft2BXkOrOeo4graIS/7lKpnaS+I9ZJjPUlHwvuHXyw/T",
    }

    let privatemint = {
        proof: "U2FsdGVkX1/K4bAsMeual84v4VJrJOGeX4aUmKomTsSYec46VMn4cndoyYVZQr3DLk33kDrYwaFQZ4LPl7zuft2BXkOrOeo4graIS/7lKpnaS+I9ZJjPUlHwvuHXyw/T",
        commit: "177865635998781929050501358969596347071678141991552299768553435551327598923537775561834708220066966777012221926915597498174",
        value: 100,
        r: "79768518321",
        pk: "1681604707407081035618785091256394631809994265875651677792083607031329260095430652697386864316136",
        enc_gover: "682839195085673321881512135777793014049382807951373993660553789804098864057746100928322554233061110546036963107"
    }

    let privatetran = {
        nullifier: "1686461110409772589677706121965434267447463573354219386181550058100585480780310706260144306684526155434681091568402520828668285043045392755175473229290581032358701555137220940895161809064937990834413624987358500712",
        commit_old:"126766486945823664982203972296048049403147400",
        commit_s:"8197848508915573981669593655289267926472624795",
        commit_r:"257352730936001279922601366891825799053444308686",
        enc_r:"5125666494632628678372974531676497818059657289",
        enc_g:"19612661448420441784222757101",
        balance_proof:"077188970972181417940380870130165618782400384804655668636575023",
        dlp_proof:"U2FsdGVkX1/K4bAsMeual84v4VJrJOGeX4aUmKomTsSYec46VMn4cndoyYVZQr3DLk33kDrYwaFQZ4LPl7zuft2BXkOrOeo4graIS/7lKpnaS+I9ZJjPUlHwvuHXyw/T",
        merkle_proof:"9566237284903974534391101376415008954816233596953893906199001112",
        commit:"177865635998781929050501358969596347071678141991552299768553435551327598923537775561834708220066966777012221926915597498174",
    }


    var l = await contract.submitTransaction('addOrder', 'register', JSON.stringify(req))
    l = await contract.submitTransaction('addOrder', 'login', JSON.stringify(login))

    l = await contract.submitTransaction('addOrder', 'erc20 mint', JSON.stringify(erc20mint))
    l = await contract.submitTransaction('addOrder', 'erc20 tran', JSON.stringify(erc20tran))

    // l = await contract.submitTransaction('addOrder', 'privatemint', JSON.stringify(privatemint))
    // l = await contract.submitTransaction('addOrder', 'privatetran', JSON.stringify(privatetran))





    console.log(l.toString())
    
    // for (let i = 5; i < 8; i++ ){
    //     var resultByte = await contract.submitTransaction('addOrder',i,'{}');
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



