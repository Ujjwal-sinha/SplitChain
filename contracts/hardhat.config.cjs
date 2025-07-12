require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")

// Ensure your PRIVATE_KEY is set in your environment variables
// For example: export PRIVATE_KEY="0x..."
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: {
    version: "0.8.20", // Ensure this matches your contract pragma
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable IR for better optimization
    },
  },
  networks: {
    blockdag: {
      url: "https://rpc.primordial.bdagscan.com",
      chainId: 1043,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 50000000000, // 50 Gwei (adjust as needed for testnet)
      gas: 20000000, // 20 million gas limit (adjust as needed)
    },
    // You can add other networks here (e.g., hardhat, localhost, other testnets)
    hardhat: {
      // Default Hardhat Network configuration
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  paths: {
    sources: "./", // Your contracts are in the root of the contracts folder
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test",
  },
  mocha: {
    timeout: 40000,
  },
}
