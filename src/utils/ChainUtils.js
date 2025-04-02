// networks.js

export const ethereumNetwork = {
  id: 1,
  caipNetworkId: "eip155:1",
  chainNamespace: "eip155",
  name: "Ethereum Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.infura.io/v3/4be3173057cd45929299e115a59c8c0d"],
    },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
  contracts: {
    // Add the contracts here if needed
  },
};
export const bnbNetwork = {
  id: 56,
  caipNetworkId: "eip155:56",
  chainNamespace: "eip155",
  name: "Binance Smart Chain",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Coin",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: ["https://bsc-dataseed.binance.org/"],
    },
  },
  blockExplorers: {
    default: { name: "BSC Explorer", url: "https://bscscan.com" },
  },
  contracts: {
    // Add the contracts here if needed
  },
};

export const ethereumSepoliaNetwork = {
  id: 11155111,
  caipNetworkId: "eip155:11155111",
  chainNamespace: "eip155",
  name: "Ethereum Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.infura.io/v3/d8aece0437db4aed9f37bf9168820b02"],
    },
  },
  blockExplorers: {
    default: { name: "Sepolia Explorer", url: "https://sepolia.etherscan.io" },
  },
  contracts: {
    // Add the contracts here if needed
  },
};

export const bnbTestnetNetwork = {
  id: 97,
  caipNetworkId: "eip155:97",
  chainNamespace: "eip155",
  name: "Binance Smart Chain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Coin",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    },
  },
  blockExplorers: {
    default: {
      name: "BSC Testnet Explorer",
      url: "https://testnet.bscscan.com",
    },
  },
  contracts: {
    // Add the contracts here if needed
  },
};
