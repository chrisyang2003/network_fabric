
cd  ./network_fabric/test-network/

./network.sh down
./network.sh up createChannel -ca -s couchdb

sudo chmod -R 777 ./organizations

./network.sh deployCC -ccp ../chaincode/test -ccl javascript -ccv 1.0 -ccn t1
./network.sh deployCC -ccp ../chaincode/order -ccl javascript -ccv 1.0 -ccn a1
# ./network.sh deployCC -ccp ./chaincode/test -ccl javascript -ccv 1.0 -ccn a4

# ./network.sh deployCC -ccp ../chaincode/zkp -ccl go -ccv 1.0 -ccn z1

# cd ../../explorer
# ./start.sh


