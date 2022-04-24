package chaincode

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"math/big"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/frontend"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

type ExpCircuit struct {
	Y frontend.Variable `gnark:",public"`
	G frontend.Variable `gnark:",public"`

	X frontend.Variable
}

func (circuit *ExpCircuit) Define(curveID ecc.ID, api frontend.API) error {
	//number of bits of exponent
	const bitSize = 256

	// specify constraints
	output := api.Constant(1)
	bits := api.ToBinary(circuit.X, bitSize)
	multiply := circuit.G

	for i := 0; i < len(bits); i++ {
		output = api.Select(bits[i], api.Mul(output, multiply), output)
		multiply = api.Mul(multiply, multiply)
	}
	api.AssertIsEqual(circuit.Y, output)

	return nil
}

func (s *SmartContract) hello(ctx contractapi.TransactionContextInterface) string {
	return "hello world"
}

type zkpParams struct {
	Data struct {
		Pk string `json:"pk"`
		Vk string `json:"vk"`
	} `json:"data"`
}

func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface, params string) error {
	var zkpara zkpParams
	json.Unmarshal([]byte(params), &zkpara)

	pk, _ := base64.StdEncoding.DecodeString(zkpara.Data.Pk)
	vk, _ := base64.StdEncoding.DecodeString(zkpara.Data.Vk)
	err := ctx.GetStub().PutState("pk", pk)
	err = ctx.GetStub().PutState("vk", vk)
	if err != nil {
		return err
	}
	return nil
}
func (s *SmartContract) Register(ctx contractapi.TransactionContextInterface, name string, userpk string) error {
	exists, err := s.UserExists(ctx, name)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("user %s already exists", name)
	}
	return ctx.GetStub().PutState(name, []byte(userpk))
}

func (s *SmartContract) UserExists(ctx contractapi.TransactionContextInterface, name string) (bool, error) {
	data, err := ctx.GetStub().GetState(name)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	return data != nil, nil
}

func (s *SmartContract) UserLogin(ctx contractapi.TransactionContextInterface, name string, vk string, proof string) (bool, error) {
	userpk, err := ctx.GetStub().GetState(name)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	if userpk == nil {
		return false, fmt.Errorf("the user %s does not exist", name)
	}

	pk := new(big.Int)
	pk.SetString(string(userpk), 10)

	publicWitness := &ExpCircuit{
		Y: frontend.Value(pk),
		G: frontend.Value(big.NewInt(3)),
	}

	userproof := groth16.NewProof(ecc.BN254)
	proofbytes, _ := base64.StdEncoding.DecodeString(proof)
	buffer := bytes.NewBuffer(proofbytes)
	userproof.ReadFrom(buffer)

	finalvk := groth16.NewVerifyingKey(ecc.BN254)
	vkbytes, _ := base64.StdEncoding.DecodeString(vk)
	finalvk.ReadFrom(bytes.NewBuffer(vkbytes))

	err = groth16.Verify(userproof, finalvk, publicWitness)
	if err != nil {
		return false, err
	} else {
		return true, err
	}

}
