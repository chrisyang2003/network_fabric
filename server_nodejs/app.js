const express = require('express')
const app = express()
const port = 3000
const fabric = require('./fabric_sdk_node/gateway')



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', async (req, res) => {
  const network = await fabric.gateway('mychannel')
  const contract = network.getContract('t2');
  var result = await contract.evaluateTransaction('info', '{"name":"123"}');
  res.send(result.toString())
})

const contractName = 'a5'


app.get('/order/getall/', async (req, res, next) => {
  try{
    const network = await fabric.gateway('mychannel')
    const contract = network.getContract(contractName);

    let result = await contract.evaluateTransaction('GetAllAssets');
    res.send(JSON.parse(result))
  }catch(err){
    next(err)
  }
})

app.get('/order/add', async (req, res, next) => {
  try{
    const network = await fabric.gateway('mychannel')
    const contract = network.getContract(contractName);
  
    order = {
      "id":1,
      "data":{
        "name":'chris',
        "age":'18'
      }
    }
    // await contract.submitTransaction('CreateAsset', '12312333', '1');
    // result = await contract.submitTransaction('CreateAsset', 'asdasdsd', 'yellow', '5', 'Tom', '1300');
    await contract.submitTransaction('InitLedger')
    // result = await contract.submitTransaction('CreateAsset', '1',JSON.stringify(order));
    // console.log(result.toString())
  }catch(err){
    next(err)
  }
})

app.get('/order/:orderno', async (req, res, next) => {
  try{
    const network = await fabric.gateway('mychannel')
    const contract = network.getContract(contractName);

    result = await contract.evaluateTransaction('ReadAsset', req.params.orderno);
    res.send(JSON.parse(result))
  }catch(err){
    next(err)
  }
})


app.use(function(err, req, res, next) {
  res.status(500).send(err.stack.toString());
});

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})