import {
  useAppKitAccount,
  useAppKitNetworkCore,
  useAppKitProvider,
} from "@reown/appkit/react";
import axios from "axios";
import { ethers } from "ethers";
import React, { useState } from "react";
import Modal from "react-modal";

function AddContractModal({ visible, onPress, onClose }) {
  const [contract, setContract] = useState("");
  const [contractDetails, setContractDetails] = useState(null);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();

  const { walletProvider } = useAppKitProvider("eip155");

  const getContractAbi = async (contractData) => {
    let url = "";
    switch (chainId) {
      case 56:
        url = `https://api.bscscan.com/api?module=contract&action=getabi&address=${contractData}&apikey=B59UD7E6VDWCP194M2K2YXX6DNTA9RHQXI`;
        break;
      case 1:
        url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractData}&apikey=5JSPKQ1ZK6X9DT3M34YBXW9CX3SU1UE9WS`;
        break;
      case 11155111:
        url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractData}&apikey=5JSPKQ1ZK6X9DT3M34YBXW9CX3SU1UE9WS`;
        break;
      case 97:
        url = `https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=${contractData}&apikey=B59UD7E6VDWCP194M2K2YXX6DNTA9RHQXI`;
        break;
      default:
        return { error: "Unsupported network" };
    }
    console.log(url);
    try {
      let response = await axios.get(url);
      if (!response.data || response.data.status !== "1") {
        return { error: "Failed to fetch ABI from explorer" };
      }
      console.log(response.data);
      return { result: response.data.result };
    } catch (error) {
      console.log(error);
      return { error: error.toString() };
    }
  };

  const fetchContractDetails = async () => {
    let data = {};
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      console.log(provider);
      const signer = provider.getSigner(address);
      const res = await getContractAbi(contract);
      if (res.error) {
        data.error = res.error;
        return data;
      }

      console.log(res);

      const contractAddress = contract;

      const contractABI = res.result;
      const contractData = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if ((await contractData.name) != undefined) {
        data.abi = res.result;
        data.name = await contractData.name();
        data.decimals = (await contractData.decimals()).toNumber
          ? (await contractData.decimals()).toNumber()
          : await contractData.decimals();

        data.symbol = await contractData.symbol();
        data.address = contractAddress;
        data.error = "";
        // console.log(data);

        setContractDetails(data);
        return data;
      }

      // Check for ERC1967 Proxy Pattern
      const ERC1967_SLOT = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(
          ethers.BigNumber.from(
            ethers.utils.keccak256(
              ethers.utils.toUtf8Bytes("eip1967.proxy.implementation")
            )
          ).sub(1)
        ),
        32
      );

      let implementationAddress = await provider.getStorageAt(
        contract,
        ERC1967_SLOT
      );
      try {
        implementationAddress = ethers.utils.getAddress(
          ethers.utils.hexStripZeros(implementationAddress)
        );

        if (
          implementationAddress &&
          implementationAddress !== ethers.constants.AddressZero
        ) {
          const implementationRes = await getContractAbi(implementationAddress);
          if (!implementationRes.error) {
            const implContract = new ethers.Contract(
              contractAddress,
              implementationRes.result,
              provider
            );

            data.abi = implementationRes.result;
            data.name = await implContract.name();
            data.symbol = await implContract.symbol();
            data.decimals = (await contractData.decimals()).toNumber
              ? (await implContract.decimals()).toNumber()
              : await implContract.decimals();

            data.address = contractAddress;
          }
          setContractDetails(data);
        }
      } catch (err) {
        console.warn("Invalid implementation address:", err);
      }

      data.error = "";

      console.log(data);
    } catch (error) {
      data.error = error.toString();

      console.log(error);
    }

    return data;
  };
  return (
    <Modal
      isOpen={visible}
      onRequestClose={() => {
        setContract("");
        setContractDetails(null);
        onClose();
      }}
      className="modal-content"
      style={{
        content: {
          width: "90%",
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          top: "15%",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1050,
        },
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="fs-5 m-0">Add Contract to Read & Write</h2>
          <button
            className="btn-close"
            onClick={() => {
              setContract("");
              setContractDetails(null);
              onClose();
            }}
            aria-label="Close"
          ></button>
        </div>

        {/* Contract Address Input */}
        <div className="mb-3">
          <label htmlFor="contractAddress" className="form-label fw-bold">
            Contract Address
          </label>
          <input
            type="text"
            id="contractAddress"
            className="form-control"
            value={contract}
            placeholder="Enter contract address"
            onChange={(e) => {
              setContractDetails(null);
              setContract(e.target.value);
            }}
          />
        </div>

        {/* Fetch Button */}
        {!contractDetails && (
          <div className="d-flex justify-content-end">
            <button
              disabled={!contract}
              className="btn btn-primary w-50"
              onClick={fetchContractDetails}
            >
              Fetch
            </button>
          </div>
        )}

        {/* Contract Details Display */}
        {contractDetails && (
          <div className="mt-4">
            <h3 className="fs-5 mb-3">Token Details</h3>

            <div className="mb-2">
              <label htmlFor="tokenName" className="form-label">
                Token Name
              </label>
              <input
                type="text"
                id="tokenName"
                className="form-control"
                disabled
                value={contractDetails.name}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="tokenDecimals" className="form-label">
                Token Decimals
              </label>
              <input
                type="text"
                id="tokenDecimals"
                className="form-control"
                disabled
                value={contractDetails.decimals}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tokenSymbol" className="form-label">
                Token Symbol
              </label>
              <input
                type="text"
                id="tokenSymbol"
                className="form-control"
                disabled
                value={contractDetails.symbol}
              />
            </div>

            {/* Continue Button */}
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success"
                onClick={() => {
                  onPress(contractDetails);
                  setContract("");
                  setContractDetails(null);
                  onClose();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default AddContractModal;
