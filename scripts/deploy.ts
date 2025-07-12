const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log(`Deploying contracts with account: ${deployer.address}`);

  // 1. Deploy SPLIT Token
  const SplitChainToken = await ethers.getContractFactory("SplitChainToken");
  const token = await SplitChainToken.deploy();
  console.log(`SPLIT Token deployed to: ${token.address}`);

  // 2. Deploy Factory
  const SplitChainFactory = await ethers.getContractFactory("SplitChainFactory");
  const factory = await SplitChainFactory.deploy();
  console.log(`Factory deployed to: ${factory.address}`);

  // 3. Deploy MultiToken
  const SplitChainMultiToken = await ethers.getContractFactory("SplitChainMultiToken");
  const multiToken = await SplitChainMultiToken.deploy();
  console.log(`MultiToken deployed to: ${multiToken.address}`);

  // 4. Deploy Core through Factory
  const tx = await factory.deployCore(100); // 1% fee
  const receipt = await tx.wait();
  const coreAddress = receipt.events[0].args.coreAddress;
  console.log(`Core deployed to: ${coreAddress}`);

  // 5. Deploy Analytics
  const SplitChainAnalytics = await ethers.getContractFactory("SplitChainAnalytics");
  const analytics = await SplitChainAnalytics.deploy(coreAddress);
  console.log(`Analytics deployed to: ${analytics.address}`);

  // 6. Deploy Governance
  const SplitChainGovernance = await ethers.getContractFactory("SplitChainGovernance");
  const governance = await SplitChainGovernance.deploy(token.address);
  console.log(`Governance deployed to: ${governance.address}`);

  console.log(`
    Deployment Complete!
    ===================
    Token: ${token.address}
    Factory: ${factory.address}
    Core: ${coreAddress}
    MultiToken: ${multiToken.address}
    Analytics: ${analytics.address}
    Governance: ${governance.address}
  `);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });