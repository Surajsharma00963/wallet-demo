//
// if you are not going to read or write smart contract, you can delete this file
//

import {
  useAppKitNetwork,
  useAppKitAccount,
  useAppKitProvider,
} from "@reown/appkit/react";
import { ethers } from "ethers";

const storageABI = [
  {
    inputs: [],
    name: "retrieve",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "num",
        type: "uint256",
      },
    ],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const SmartContractActionButtonList = () => {
  const { isConnected } = useAppKitAccount(); // AppKit hook to get the address and check if the user is connected
  const { chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider("eip155");

  const storageSC = "0xEe6D291CC60d7CeD6627fA4cd8506912245c8cA4";

  const handleReadSmartContract = async () => {
    console.log("Read Sepolia Smart Contract");
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = ethersProvider.getSigner();
    const contract = new new ethers.Contract(storageSC, storageABI, signer)();
    const data = await contract.retrieve();
    console.log("data: ", data);
  };

  const handleWriteSmartContract = async () => {
    console.log("Write Sepolia Smart Contract");
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new ethers.Contract(storageSC, storageABI, signer);
    const data = await contract.store(1n);
    console.log("data: ", data);
  };

  return (
    isConnected && ( // Only show the buttons if the user is connected to Sepolia
      <div>
        <button onClick={handleReadSmartContract}>
          Read Sepolia Smart Contract
        </button>
        <button onClick={handleWriteSmartContract}>
          Write Sepolia Smart Contract
        </button>
      </div>
    )
  );
};
