// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy SPLIT Token
  const SplitChainToken = await ethers.getContractFactory("SplitChainToken");
  const splitToken = await SplitChainToken.deploy();
  console.log("SPLIT Token:", await splitToken.getAddress());

  // Deploy Factory
  const SplitChainFactory = await ethers.getContractFactory("SplitChainFactory");
  const factory = await SplitChainFactory.deploy();
  console.log("Factory:", await factory.getAddress());

  // Deploy Core via Factory
  const tx = await factory.deploySplitChain(ethers.parseEther("0.01"));
  const receipt = await tx.wait();
  const coreAddress = receipt.logs[0].args.contractAddress;
  console.log("SplitChainCore:", coreAddress);
}

main().catch(console.error);