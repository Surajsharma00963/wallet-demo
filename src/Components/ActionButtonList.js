import {
  useDisconnect,
  useAppKit,
  useAppKitNetwork,
  useAppKitAccount,
  useAppKitProvider,
  useAppKitNetworkCore,
} from "@reown/appkit/react";
import { networks } from "../config";
import { ethers } from "ethers";
import { useState } from "react";
import { eip712 } from "../utils/eip712";
import SendModal from "./Modal/SendModal";
import ContractModal from "./Modal/ContractModal";
import AddContractModal from "./Modal/AddContractModal";

const ActionButtonList = ({
  sendHash,
  sendSignMsg,
  sendBalance,
  setContract,
  contract,
}) => {
  const storageSC = "0xEe6D291CC60d7CeD6627fA4cd8506912245c8cA4";

  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { chainId } = useAppKitNetworkCore();
  const { switchNetwork } = useAppKitNetwork();
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const [sendModal, setSendModal] = useState(false);
  const [contractModal, setContractModal] = useState(false);
  const [addContractModal, setAddContractModal] = useState(false);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setContract(null);
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  // function to send a tx
  const handleSendTx = async (transaction) => {
    try {
      if (!walletProvider || !address) throw Error("user is disconnected");
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      await ethersProvider.ready;
      const signer = ethersProvider.getSigner();
      const tx = await signer.sendTransaction(transaction);
      await tx.wait(); // This will wait for the transaction to be mined
      sendHash(tx.hash);
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  // function to sing a msg
  const handleSignMsg = async () => {
    if (!walletProvider || !address) throw Error("user is disconnected");

    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = ethersProvider.getSigner();
    const sig = await signer?.signMessage("Hello Reown AppKit!");

    sendSignMsg(sig);
  };

  // function to get the balance
  const handleGetBalance = async () => {
    if (!walletProvider || !address) throw Error("user is disconnected");

    const provider = new ethers.providers.Web3Provider(walletProvider);
    const balance = await provider.getBalance(address);
    const eth = ethers.utils.formatEther(balance);
    sendBalance(`${eth} ETH`);
  };
  const handleReadSmartContract = async () => {
    if (contract === null) {
      return alert("Add Contract before reading");
    }
    console.log(contract);
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = ethersProvider.getSigner();
    const contractData = new ethers.Contract(
      contract.address,
      contract.abi,
      signer
    );
    const decimals = await contractData.decimals();
    const balance = await contractData.balanceOf(address);
    console.log(balance.toString());

    setContract({
      ...contract,
      balance: ethers.utils.formatUnits(balance, decimals),
    });
  };

  const handleWriteSmartContract = async (item) => {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const contractData = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
      );
      const tx = {
        to: contractData.address,
        data: contractData.interface.encodeFunctionData("transfer", [
          item.to,
          item.value,
        ]),
        value: 0,
      };

      const txResponse = await signer.sendTransaction(tx);

      const receipt = await txResponse.wait();
    } catch (error) {
      console.error("Transaction Error:", error.message);
    }

    // const data = await contractData.store(1n);
  };
  const handleSignedTypev4 = async () => {
    if (!isConnected || !walletProvider) {
      return;
    }

    try {
      const message = JSON.stringify(eip712.example);

      // eth_signTypedData_v4 params
      const params = [address, message];

      // send message
      const signature = await walletProvider.request({
        method: "eth_signTypedData_v4",
        params: params,
      });
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  // function ActionButtonList() {
  return (
    <div className="mx-auto">
      {isConnected ? (
        <div className="container-fluid">
          <div className="row col-6 d-flex align-items-center justify-content-center w-100 mx-0">
            <div className="col-6">
              <button
                className="btn btn-dark w-100 mx-0"
                onClick={() => open()}
              >
                Open
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-dark w-100 mx-0"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            </div>
            <div className="col-6 ">
              <button
                className="btn btn-dark w-100 mx-0"
                onClick={handleSignMsg}
              >
                Sign msg
              </button>
            </div>
            <div className="col-6 ">
              <button
                className="btn btn-dark w-100 mx-0"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#sendModal"
                onClick={() => {
                  setSendModal(true);
                }}
              >
                Send tx
              </button>
            </div>
            <div className="col-6 ">
              <button
                className="btn btn-dark w-100 mx-0"
                onClick={handleSignedTypev4}
              >
                Sign data (v4)
              </button>
            </div>
            <div className="col-6 ">
              <button
                className="btn btn-dark w-100 mx-0"
                onClick={handleGetBalance}
              >
                Get Balance
              </button>
            </div>
            <div className="col-6 ">
              <button
                className="btn btn-dark w-100 mx-0"
                onClick={() => setAddContractModal(true)}
              >
                Add Contract
              </button>
            </div>
            <div className="col-6 ">
              <button
                className="btn btn-dark w-100 mx-0"
                onClick={handleReadSmartContract}
              >
                Read Contract
              </button>
            </div>
            <div className="col-6 ">
              <button
                className="btn btn-dark w-100 mx-0"
                onClick={() => {
                  if (contract === null) {
                    return alert("Add Contract before wrting");
                  }
                  setContractModal(true);
                }}
              >
                Write Contract
              </button>
            </div>
          </div>
          <div className="w-50">
            <SendModal
              visible={sendModal}
              onPress={(tx) => {
                handleSendTx(tx);
              }}
              onClose={() => {
                setSendModal(false);
              }}
            />
            <ContractModal
              visible={contractModal}
              contract={contract}
              onPress={(item) => {
                handleWriteSmartContract(item);
              }}
              onClose={() => {
                setContractModal(false);
              }}
            />
            <AddContractModal
              visible={addContractModal}
              onPress={(item) => {
                setContract(item);
              }}
              onClose={() => {
                setAddContractModal(false);
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
  // }
};

export default ActionButtonList;
