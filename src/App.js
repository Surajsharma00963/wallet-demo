import { createAppKit } from "@reown/appkit/react";
import "./App.css";
import {
  networks,
  projectId,
  metadata,
  ethersAdapter,
  siweConfig,
} from "./config";

import { useState } from "react";
import ActionButtonList from "./Components/ActionButtonList";
import { InfoList } from "./Components/InfoList";

const customWallets = [
  {
    id: "diam-wallet",
    name: "DIAM Wallet",
    image_url:
      "https://play-lh.googleusercontent.com/HM0G9lgsAtzbpkujqhPA86CR04tgzDUOAviER5yARNBlOsqSpamW8ZtjTJ1Snl1yMGJv=w240-h480-rw",
    mobile_link: "https://dwconnect.diamante.io",
    redirect: {
      native: window.location.origin,
    },
    // link_mode: "universal_link",
  },
];

// Create modal and AppKit configuration
createAppKit({
  adapters: [ethersAdapter],

  defaultNetwork: networks[0],
  metadata: metadata,
  customWallets,
  networks: networks, // Ensure at least one network is provided
  projectId,
  // siweConfig: siweConfig, // pass your siweConfig
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

function App() {
  const [transactionHash, setTransactionHash] = useState("");
  const [signedMsg, setSignedMsg] = useState("");
  const [balance, setBalance] = useState("");
  const [contract, setContract] = useState(null);

  const receiveHash = (hash) => {
    setTransactionHash(hash); // Update the state with the transaction hash
  };

  const receiveSignedMsg = (signedMsg) => {
    setSignedMsg(signedMsg); // Update the state with the transaction hash
  };

  const receivebalance = (balance) => {
    setBalance(balance);
  };

  return (
    <div className="container text-center py-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <img
            src="/reown.svg"
            alt="Reown"
            className="img-fluid"
            style={{ width: "150px", height: "150px" }}
          />
        </div>
        <div className="col-12">
          <h1 className="text-dark">AppKit ethers React dApp Example</h1>
        </div>
        <div className="col-12 w-100 align-item-center justify-content-center d-flex">
          <appkit-button />
        </div>
        <div className="col-12 col-md-8 ">
          <ActionButtonList
            sendHash={receiveHash}
            sendSignMsg={receiveSignedMsg}
            sendBalance={receivebalance}
            setContract={setContract}
            contract={contract}
          />
        </div>
        <div className="col-12 col-md-8 mx-0">
          <InfoList
            hash={transactionHash}
            signedMsg={signedMsg}
            balance={balance}
            contract={contract}
            setContract={setContract}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
