const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy SplitChainToken first
  console.log("Deploying SplitChainToken...");
  const SplitChainToken = await ethers.getContractFactory("SplitChainToken");
  const token = await SplitChainToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("SplitChainToken deployed to:", tokenAddress);

  // Deploy SplitChainCore with 1% platform fee (100 basis points)
  console.log("Deploying SplitChainCore...");
  const platformFeeBP = 100; // 1%
  const SplitChainCore = await ethers.getContractFactory("SplitChainCore");
  const core = await SplitChainCore.deploy(platformFeeBP);
  await core.waitForDeployment();
  const coreAddress = await core.getAddress();
  console.log("SplitChainCore deployed to:", coreAddress);

  // Deploy SplitChainFactory
  console.log("Deploying SplitChainFactory...");
  const SplitChainFactory = await ethers.getContractFactory("SplitChainFactory");
  const factory = await SplitChainFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("SplitChainFactory deployed to:", factoryAddress);

  // Deploy SplitChainMultiToken
  console.log("Deploying SplitChainMultiToken...");
  const SplitChainMultiToken = await ethers.getContractFactory("SplitChainMultiToken");
  const multiToken = await SplitChainMultiToken.deploy();
  await multiToken.waitForDeployment();
  const multiTokenAddress = await multiToken.getAddress();
  console.log("SplitChainMultiToken deployed to:", multiTokenAddress);

  // Deploy SplitChainAnalytics (needs core address)
  console.log("Deploying SplitChainAnalytics...");
  const SplitChainAnalytics = await ethers.getContractFactory("SplitChainAnalytics");
  const analytics = await SplitChainAnalytics.deploy(coreAddress);
  await analytics.waitForDeployment();
  const analyticsAddress = await analytics.getAddress();
  console.log("SplitChainAnalytics deployed to:", analyticsAddress);

  // Deploy SplitChainGovernance (needs token address)
  console.log("Deploying SplitChainGovernance...");
  const SplitChainGovernance = await ethers.getContractFactory("SplitChainGovernance");
  const governance = await SplitChainGovernance.deploy(tokenAddress);
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  console.log("SplitChainGovernance deployed to:", governanceAddress);

  // Save deployed addresses to a file for frontend use
  const contracts = {
    token: tokenAddress,
    core: coreAddress,
    factory: factoryAddress,
    multiToken: multiTokenAddress,
    analytics: analyticsAddress,
    governance: governanceAddress,
  };
  fs.writeFileSync("deployed-contracts.json", JSON.stringify(contracts, null, 2));
  console.log("Contract addresses saved to deployed-contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });