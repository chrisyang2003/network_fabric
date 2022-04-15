
const network = require('./gateway')


async function mian(){
    const contract = network.getContract('basic');
    const result = await contract.evaluateTransaction('InitLedger');

}

mian()

