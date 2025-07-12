const { ethers } = require("hardhat")

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log("Deploying contracts with the account:", deployer.address)

  // 1. Deploy SplitChainToken
  const SplitChainToken = await ethers.getContractFactory("SplitChainToken")
  const splitChainToken = await SplitChainToken.deploy()
  await splitChainToken.deployed()
  console.log("SplitChainToken deployed to:", splitChainToken.address)

  // 2. Deploy SplitChainCore
  // Initial fee: 100 = 1% (10000 = 100%)
  const SplitChainCore = await ethers.getContractFactory("SplitChainCore")
  const splitChainCore = await SplitChainCore.deploy(100, deployer.address)
  await splitChainCore.deployed()
  console.log("SplitChainCore deployed to:", splitChainCore.address)

  // 3. Deploy SplitChainFactory
  const SplitChainFactory = await ethers.getContractFactory("SplitChainFactory")
  const splitChainFactory = await SplitChainFactory.deploy()
  await splitChainFactory.deployed()
  console.log("SplitChainFactory deployed to:", splitChainFactory.address)

  // 4. Deploy SplitChainAnalytics
  const SplitChainAnalytics = await ethers.getContractFactory("SplitChainAnalytics")
  const splitChainAnalytics = await SplitChainAnalytics.deploy(splitChainCore.address)
  await splitChainAnalytics.deployed()
  console.log("SplitChainAnalytics deployed to:", splitChainAnalytics.address)

  // 5. Deploy SplitChainMultiToken
  const SplitChainMultiToken = await ethers.getContractFactory("SplitChainMultiToken")
  const splitChainMultiToken = await SplitChainMultiToken.deploy()
  await splitChainMultiToken.deployed()
  console.log("SplitChainMultiToken deployed to:", splitChainMultiToken.address)

  // 6. Deploy TimelockController for Governance
  // minDelay: 1 hour (3600 seconds)
  // proposers: empty array initially, will be granted roles later
  // executors: empty array initially, will be granted roles later
  // admin: deployer (initially)
  const TimelockController = await ethers.getContractFactory("TimelockController")
  const minDelay = 3600 // 1 hour
  const proposers = [] // No initial proposers
  const executors = [] // No initial executors
  const admin = deployer.address // Deployer is initial admin

  const timelockController = await TimelockController.deploy(minDelay, proposers, executors, admin)
  await timelockController.deployed()
  console.log("TimelockController deployed to:", timelockController.address)

  // Grant roles to the deployer for the TimelockController
  const PROPOSER_ROLE = await timelockController.PROPOSER_ROLE()
  const EXECUTOR_ROLE = await timelockController.EXECUTOR_ROLE()
  const ADMIN_ROLE = await timelockController.TIMELOCK_ADMIN_ROLE()

  await timelockController.grantRole(PROPOSER_ROLE, deployer.address)
  console.log(`Granted PROPOSER_ROLE to ${deployer.address}`)
  await timelockController.grantRole(EXECUTOR_ROLE, deployer.address)
  console.log(`Granted EXECUTOR_ROLE to ${deployer.address}`)

  // 7. Deploy SplitChainGovernance
  const SplitChainGovernance = await ethers.getContractFactory("SplitChainGovernance")
  const splitChainGovernance = await SplitChainGovernance.deploy(splitChainToken.address, timelockController.address)
  await splitChainGovernance.deployed()
  console.log("SplitChainGovernance deployed to:", splitChainGovernance.address)

  // Transfer TimelockController ownership to the Governance contract
  // This is crucial: the governance contract should control the timelock
  await timelockController.transferOwnership(splitChainGovernance.address)
  console.log("TimelockController ownership transferred to SplitChainGovernance.")

  // Renounce admin role from deployer if desired (optional, but good practice for decentralization)
  // await timelockController.renounceRole(ADMIN_ROLE, deployer.address);
  // console.log("Deployer renounced TIMELOCK_ADMIN_ROLE.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
