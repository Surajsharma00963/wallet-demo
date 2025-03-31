export const mainnet = {
  id: 1,
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
  namespace: "eip155",
};

export const sepolia = {
  id: 11155111,
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://sepolia.infura.io/v3/c4ce3e1336ba4711b054713d6027bfcf",
  namespace: "eip155",
};

export const binance = {
  id: 56,
  chainId: 56,
  name: "Binance Smart Chain",
  currency: "BNB",
  explorerUrl: "https://bscscan.com",
  rpcUrl: "https://bsc-dataseed.bnbchain.org",
  namespace: "eip155",
};

export const binanceTestnet = {
  id: 97,
  chainId: 97,
  name: "Binance Smart Chain Testnet",
  currency: "BNB",
  explorerUrl: "http://testnet.bscscan.com/",
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  namespace: "eip155",
};

export const tronMainnet = {
  chainId: 728126428, // Example chainId for Tron mainnet
  name: "Tron Mainnet",
  currency: "TRX",
  explorerUrl: "http://tronscan.org/",
  rpcUrl: "https://api.trongrid.io",
  namespace: "tron",
};

export const tronTestnet = {
  chainId: "tron:2", // Example chainId for Tron testnet
  chainName: "Tron Testnet",
  rpcUrl: "https://api.shasta.trongrid.io",
  nativeCurrency: { name: "Tron", symbol: "TRX", decimals: 6 },
};
