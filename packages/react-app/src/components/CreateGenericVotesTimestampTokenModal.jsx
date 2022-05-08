import React, {useState} from 'react';
import { Input, Modal, Form, Divider, Checkbox } from "antd";

import DeployedGenericVotesTimestampTokenContract from "../contracts/bytecodeAndAbi/GenericVotesTimestampToken.sol/GenericVotesTimestampToken.json";

const { ethers } = require("ethers");

export default function CreateGenericVotesTimestampTokenModal({modalVisible, setModalVisible, setResultMessage, signer}) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [mintingRecipient, setMintingRecipient] = useState("")
  const [amountToMint, setAmountToMint] = useState("")
  const [isNontransferable, setIsNontransferable] = useState(false)

  const handleOk = async () => {
    // The factory we use for deploying contracts
    let factory = new ethers.ContractFactory(DeployedGenericVotesTimestampTokenContract.abi, DeployedGenericVotesTimestampTokenContract.bytecode, signer)
    console.log(factory)

    // Deploy an instance of the contract
    let contract = await factory.deploy(tokenName, tokenSymbol, mintingRecipient, amountToMint, isNontransferable);
    console.log(contract.address)
    console.log(contract.deployTransaction)
    setResultMessage("The " + tokenName + " token contract creation transaction has been submitted with this transaction id: " + contract.deployTransaction.hash + " for the contract to be deployed at this address: " + contract.address)
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal title="Create Votes Token (ERC20VotesTimestamp)" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h4>Token Name: the name you would like your token to have</h4>
        <h4>Token Symbol: the symbol (ie. JOKE) you would like your token to have</h4>
        <h4>Minting Recipient: the address that the created tokens will be minted to</h4>
        <h4>Amount To Mint: the number of tokens to mint to the minting recipient</h4>
        <h4>Non-transferable: do you want this token to only be transferable by the creator and accounts the creator has approved an allowance for as well as burnable?</h4>
        <h4>The voting power of these tokens will be delegated by default to the addresses that hold them, holders can always delegate to others if they would like though</h4>
        <Divider />
        <Form.Item
          label="Token Name"
          name="tokenname"
          rules={[{ required: true, message: 'Please input your token title!' }]}
        >
          <Input placeholder='Token Name' onChange={(e) => setTokenName(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Token Symbol"
          name="tokensymbol"
          rules={[{ required: true, message: 'Please input your token symbol!' }]}
        >
          <Input placeholder='Token Symbol' onChange={(e) => setTokenSymbol(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Minting Recipient"
          name="mintingrecipient"
          rules={[{ required: true, message: 'Please input your minting recipient address!' }]}
        >
          <Input placeholder='Minting Recipient' onChange={(e) => setMintingRecipient(e.target.value.trim().replace(/['"]+/g, ''))} />
        </Form.Item>
        <Form.Item
          label="Amount To Mint"
          name="amounttomint"
          rules={[{ required: true, message: 'Please input the amount of tokens to mint to the recipient!' }]}
        >
          <Input placeholder='Amount To Mint' onChange={(e) => setAmountToMint(ethers.utils.parseEther(e.target.value))} />
        </Form.Item>
        <Form.Item
          label="Non-transferable?"
          name="nontransferable"
        >
          <Checkbox onChange={(e) => setIsNontransferable(e.target.checked)} />
        </Form.Item>
      </Form>
    </Modal>
  );
}