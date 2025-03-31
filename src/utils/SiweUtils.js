import { AppKitNetwork } from "@reown/appkit/networks";
import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";
// import { getAddress } from "viem";
import { generateRandomBytes32 } from "@walletconnect/utils";
import { getAddress } from "ethers/lib/utils";

const BASE_URL = "http://localhost:8080";
const LOGGED_IN_KEY = "@w3mwagmi/logged_in";

// Normalize the address (checksum)
const normalizeAddress = (address) => {
  try {
    const splitAddress = address.split(":");
    const extractedAddress = splitAddress[splitAddress.length - 1];
    const checksumAddress = getAddress(extractedAddress);
    splitAddress[splitAddress.length - 1] = checksumAddress;
    const normalizedAddress = splitAddress.join(":");

    return normalizedAddress;
  } catch (error) {
    return address;
  }
};

// Generate a nonce for CSRF protection
const getNonce = async () => {
  const nonce = generateRandomBytes32();
  return nonce;
};

// Verify the signed message and store session
const verifyMessage = async ({ message, signature }) => {
  sessionStorage.setItem(LOGGED_IN_KEY, "true");
  return true;
};

// Retrieve session from AsyncStorage
const getSession = async () => {
  const logged = sessionStorage.getItem(LOGGED_IN_KEY);
  if (logged === "true") {
    return {
      address: "0x",
      chainId: 1,
    };
  }
  return null;
};

// Sign out and remove session from AsyncStorage
const signOut = async () => {
  sessionStorage.removeItem(LOGGED_IN_KEY);
  return true;
};

export const createSIWE = (chains) => {
  return createSIWEConfig({
    signOutOnAccountChange: true,
    signOutOnNetworkChange: true,
    getMessageParams: async () => ({
      domain: "w3mwagmisample://",
      uri: "w3mwagmisample://",
      chains: chains.map((chain) => parseInt(chain.id.toString())),
      statement: "Welcome to the dApp! Please sign this message",
      iat: new Date().toISOString(),
    }),
    createMessage: ({ address, ...args }) => {
      return formatMessage(args, normalizeAddress(address));
    },
    getNonce,
    getSession,
    verifyMessage,
    signOut,
  });
};
