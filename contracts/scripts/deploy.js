const { ethers } = require("hardhat")

async function main() {
  const network = await ethers.provider.getNetwork() // Declare the network variable
  console.log("Deploying SplitChain contracts...")

  // Deploy SplitChainToken
  const SplitChainToken = await ethers.getContractFactory("SplitChainToken")
  const token = await SplitChainToken.deploy()
  await token.deployed()
  console.log("SplitChainToken deployed to:", token.address)

  // Deploy SplitChainCore
  const SplitChainCore = await ethers.getContractFactory("SplitChainCore")
  const core = await SplitChainCore.deploy()
  await core.deployed()
  console.log("SplitChainCore deployed to:", core.address)

  // Deploy SplitChainFactory
  const SplitChainFactory = await ethers.getContractFactory("SplitChainFactory")
  const factory = await SplitChainFactory.deploy()
  await factory.deployed()
  console.log("SplitChainFactory deployed to:", factory.address)

  // Deploy SplitChainMultiToken
  const SplitChainMultiToken = await ethers.getContractFactory("SplitChainMultiToken")
  const multiToken = await SplitChainMultiToken.deploy()
  await multiToken.deployed()
  console.log("SplitChainMultiToken deployed to:", multiToken.address)

  // Deploy SplitChainAnalytics
  const SplitChainAnalytics = await ethers.getContractFactory("SplitChainAnalytics")
  const analytics = await SplitChainAnalytics.deploy(core.address)
  await analytics.deployed()
  console.log("SplitChainAnalytics deployed to:", analytics.address)

  // Save deployment addresses
  const deployments = {
    SplitChainToken: token.address,
    SplitChainCore: core.address,
    SplitChainFactory: factory.address,
    SplitChainMultiToken: multiToken.address,
    SplitChainAnalytics: analytics.address,
    network: network.name,
    chainId: network.config.chainId,
  }

  console.log("\nDeployment Summary:")
  console.log(JSON.stringify(deployments, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
