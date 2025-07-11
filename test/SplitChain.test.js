const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("SplitChain Contracts", function () {
  let owner, addr1, addr2
  let token, core, factory, multiToken, analytics

  before(async function () {
    [owner, addr1, addr2] = await ethers.getSigners()

    // Deploy SplitChainToken
    const SplitChainToken = await ethers.getContractFactory("SplitChainToken")
    token = await SplitChainToken.deploy()
    await token.deployed()

    // Deploy SplitChainCore
    const SplitChainCore = await ethers.getContractFactory("SplitChainCore")
    core = await SplitChainCore.deploy()
    await core.deployed()

    // Deploy SplitChainFactory
    const SplitChainFactory = await ethers.getContractFactory("SplitChainFactory")
    factory = await SplitChainFactory.deploy()
    await factory.deployed()

    // Deploy SplitChainMultiToken
    const SplitChainMultiToken = await ethers.getContractFactory("SplitChainMultiToken")
    multiToken = await SplitChainMultiToken.deploy()
    await multiToken.deployed()

    // Deploy SplitChainAnalytics with Core address
    const SplitChainAnalytics = await ethers.getContractFactory("SplitChainAnalytics")
    analytics = await SplitChainAnalytics.deploy(core.address)
    await analytics.deployed()
  })

  describe("Deployment Checks", function () {
    it("Should deploy all contracts with valid addresses", async function () {
      expect(token.address).to.properAddress
      expect(core.address).to.properAddress
      expect(factory.address).to.properAddress
      expect(multiToken.address).to.properAddress
      expect(analytics.address).to.properAddress
    })
  })

  describe("SplitChainToken", function () {
    it("Should have correct initial values", async function () {
      const name = await token.name()
      const symbol = await token.symbol()
      expect(name).to.be.a("string")
      expect(symbol).to.be.a("string")
    })
  })

  describe("SplitChainAnalytics", function () {
    it("Should be linked to the correct Core contract", async function () {
      const coreAddressInAnalytics = await analytics.core()
      expect(coreAddressInAnalytics).to.equal(core.address)
    })
  })

  // Add more tests as per the actual logic of your contracts
})
