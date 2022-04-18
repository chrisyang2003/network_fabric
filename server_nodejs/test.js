const fabric = require('./fabric_sdk_node/gateway')



async function main(){
    const network = await fabric.gateway('mychannel')
    const contract = network.getContract('a3');
    var result

    result = await contract.evaluateTransaction('hello');
    console.log(result.toString());
    

    // result = await contract.submitTransaction('addOrder', '1', '{"name": "123"}');
    // console.log(JSON.parse(result));


    result = await contract.evaluateTransaction('ReadAsset', 20220418092635)
    console.log(JSON.parse(result));

    // result = await contract.evaluateTransaction('GetAllAssets')
    // console.log(JSON.parse(result));
    

    // result = await contract.evaluateTransaction('GetAllAssets');
    // console.log(result.toString());
}

main()



