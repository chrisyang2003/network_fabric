
sudo rm -rf ./organizations/

cp -r ../fabric-samples/test-network/organizations/ .


docker-compose down -v
docker-compose up -d
