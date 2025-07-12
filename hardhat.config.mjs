require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      viaIR: true,
    },
  },
  networks: {
    blockdag: {
      url: process.env.BLOCKDAG_RPC || "https://rpc.primordial.bdagscan.com",
      chainId: 1043,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 50000000000,
    },
    hardhat: {
      chainId: 31337,
    },
  },
  mocha: {
    timeout: 60000,
  },
};