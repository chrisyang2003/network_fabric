const express = require('express')
const app = express()
const port = 3000
const fabric = require('./fabric_sdk_node/gateway')
const {BlockDecoder} = require('fabric-common')


app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")


  console.log('[+]', req.url)
  // console.log('[+]', req.headers)
  next()
})
app.options('/:any', (req, res) => {
  res.send('Hello World!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', async (req, res) => {
  const network = await fabric.gateway('mychannel')
  const contract = network.getContract('t1');
  var result = await contract.evaluateTransaction('info', '{"name":"123"}');
  res.send(result.toString())
})

const contractName = 'a1'

var balance = 0
app.get('/balance/erc20', async(req, res, next) => {
  balance += 1
  res.send(JSON.stringify({balance: balance}))
})

var privatebalance = 0
app.get('/balance/private', async(req, res, next) => {
  privatebalance += 1
  res.send(JSON.stringify({balance: privatebalance}))
})


app.get('/order/getall', async (req, res, next) => {
  try{
    const network = await fabric.gateway('mychannel')
    const contract = network.getContract('a1');

    let result = await contract.evaluateTransaction('getAllorder');
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
    // result = await contract.submitTransaction('CreateAsset', '1',JSON.stringify(order));
    // console.log(result.toString())
  }catch(err){
    next(err)
  }
})



async function getTrxDetailById(id){
  const network = await fabric.gateway('mychannel')
    const contract = network.getContract('qscc');

    var resultByte = await contract.evaluateTransaction('GetTransactionByID','mychannel', id);
    const unSerialization = BlockDecoder.decodeTransaction(resultByte).transactionEnvelope.payload
    
    const header = unSerialization.header.channel_header
    const mspid = unSerialization.header.signature_header.creator.mspid

    const writeset = unSerialization.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[0]
    const writekey = writeset.key
    const writedata = writeset.value.toString()
    const ccname = unSerialization.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name

    return {
        writekey:writekey,
        timestamp: header.timestamp,
        channel_id: header.channel_id,
        trx: header.tx_id,
        ccname: ccname,
        mspid:mspid,
        data: writedata
    }
}

app.get('/order/get', async (req, res, next) => {
  try{
    const id = req.query.id
    if (!id){
      res.status(400).send('empty!')
      return
    }
    const network = await fabric.gateway('mychannel')
    const contract = network.getContract('a1');

    result = await contract.evaluateTransaction('getOrder', id);
    const trx = JSON.parse(result).trx
    res.send(await getTrxDetailById(trx))
  }catch(err){
    next(err)
  }
})




app.get('/trx/get', async (req, res, next) => {
  try{    
    const id = req.query.id
    if (!id){
      res.send('id为空')
      return
    }
    
    res.send(msg)

  }catch(err){
    next(err)
  }
})


app.use(function(err, req, res, next) {
  res.status(500).send(err.stack.toString());
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})