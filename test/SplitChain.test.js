const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SplitChain Contracts", function () {
  let token, factory, core, multiToken, analytics, governance;
  let owner, user1, user2;

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy Token
    const SplitChainToken = await ethers.getContractFactory("SplitChainToken");
    token = await SplitChainToken.deploy();

    // Deploy Factory
    const SplitChainFactory = await ethers.getContractFactory("SplitChainFactory");
    factory = await SplitChainFactory.deploy();

    // Deploy Core through Factory
    await factory.deployCore(100);
    const coreAddress = (await factory.deployedContracts())[0];
    core = await ethers.getContractAt("SplitChainCore", coreAddress);

    // Deploy other contracts
    const SplitChainMultiToken = await ethers.getContractFactory("SplitChainMultiToken");
    multiToken = await SplitChainMultiToken.deploy();

    const SplitChainAnalytics = await ethers.getContractFactory("SplitChainAnalytics");
    analytics = await SplitChainAnalytics.deploy(core.address);

    const SplitChainGovernance = await ethers.getContractFactory("SplitChainGovernance");
    governance = await SplitChainGovernance.deploy(token.address);
  });

  describe("Token Contract", function () {
    it("Should have correct initial supply", async function () {
      expect(await token.totalSupply()).to.equal(ethers.parseEther("1000000000"));
    });
  });

  describe("Factory Contract", function () {
    it("Should deploy new Core contracts", async function () {
      await expect(factory.connect(user1).deployCore(100))
        .to.emit(factory, "NewCoreDeployed");
    });
  });

  describe("MultiToken Contract", function () {
    it("Should allow owner to add supported tokens", async function () {
      await multiToken.connect(owner).addToken(user1.address, ethers.parseEther("1.5"));
      expect(await multiToken.supportedTokens(user1.address)).to.be.true;
    });
  });

  // More tests for each contract...
});