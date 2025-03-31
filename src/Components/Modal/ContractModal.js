import { ethers } from "ethers";
import React, { useState } from "react";
import Modal from "react-modal";

function ContractModal({ visible, onPress, onClose, contract }) {
  console.log(contract);
  const contractDetails = contract;
  console.log(contractDetails, "=====");
  const [amount, setAmount] = useState("");

  const [recieverAddress, setRecieverAddress] = useState("");
  const [recieverAddressInput, setRecieverAddresInput] = useState(false);
  const [recieverAddressValid, setRecieverAddressValid] = useState(false);
  const validateAdress = () => {
    let valid = ethers.utils.isAddress(recieverAddress);
    setRecieverAddressValid(valid);
  };
  return (
    <Modal
      isOpen={visible}
      onRequestClose={() => {
        setRecieverAddressValid(false);
        setRecieverAddress("");
        setAmount("");
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
          top: "20%",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1050,
        },
      }}
    >
      <div className="container">
        {/* Modal Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h2 className="m-0">Send {contractDetails?.symbol} Token</h2>
          </div>
          <div className="">
            <button
              className="btn-close m-0 p-0"
              onClick={() => {
                setRecieverAddressValid(false);
                setRecieverAddress("");
                setAmount("");
                onClose();
              }}
              aria-label="Close"
            ></button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-bold">Receiver Address</label>
            <input
              type="text"
              className="form-control"
              value={recieverAddress}
              placeholder="Enter receiver address"
              onChange={(e) => setRecieverAddress(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-bold">Amount</label>
            <input
              type="text"
              className="form-control"
              value={amount}
              placeholder="Enter amount"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          {!recieverAddressValid ? (
            <button
              className="btn btn-primary"
              disabled={!recieverAddress || parseFloat(amount || 0) <= 0}
              onClick={validateAdress}
            >
              Validate
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => {
                onPress({
                  to: recieverAddress,
                  value: ethers.utils.parseUnits(amount),
                });
              }}
            >
              Send
            </button>
          )}

          <button
            className="btn btn-danger"
            onClick={() => {
              setRecieverAddressValid(false);
              setRecieverAddress("");
              setAmount("");
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ContractModal;
