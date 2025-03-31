import { mainnet, sepolia, bsc, bscTestnet, st } from "@reown/appkit/networks";
import { AppKitNetwork } from "@reown/appkit/networks";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { createSIWE } from "../utils/SiweUtils";

// Get projectId from https://cloud.reown.com
export const projectId = "503c8443afe6c595a7f1178254fb004a"; // this is a public projectId only to use on localhost

console.log(projectId);
if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Create a metadata object - optional
export const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://reown.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [mainnet, bsc, bscTestnet, sepolia];
export const siweConfig = createSIWE(networks);

// Set up Solana Adapter
export const ethersAdapter = new Ethers5Adapter();
