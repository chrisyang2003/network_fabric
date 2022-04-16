const express = require('express')
const app = express()
const port = 3000
const fabric = require('./fabric_sdk_node/gateway')

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.get('/test', async (req, res) => {
  const network = await fabric.gateway('mychannel')
  const contract = network.getContract('basic');
  var result = await contract.evaluateTransaction('GetAllAssets');
  
  res.send(JSON.parse(result.toString()))

})



app.get('/order/add', function (req, res){

    res.send('order add')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})