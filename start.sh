
cd  ./network_fabric/test-network/

./network.sh down
./network.sh up createChannel -ca -s couchdb

sudo chmod -R 777 ./organizations

./network.sh deployCC -ccp ../chaincode/test -ccl javascript -ccv 1.0 -ccn t1
./network.sh deployCC -ccp ../chaincode/hotel -ccl javascript -ccv 1.0 -ccn a1
# ./network.sh deployCC -ccp ./chaincode/test -ccl javascript -ccv 1.0 -ccn a4

# cd ../../explorer
# ./start.sh


