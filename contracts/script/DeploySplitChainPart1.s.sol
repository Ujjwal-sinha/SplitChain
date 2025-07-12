// script/DeploySplitChainPart1.s.sol
pragma solidity ^0.8.19;
import {console} from "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {SplitChainToken} from "../SplitChainToken.sol";
import {SplitChainCore} from "../SplitChainCore.sol";
import {SplitChainFactory} from "../SplitChainFactory.sol";

contract DeploySplitChainPart1 is Script {
    function run() external returns (address splitChainTokenAddress, address splitChainCoreAddress, address splitChainFactoryAddress) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        console.log("Starting broadcast, gas left:", gasleft());
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying SplitChainToken, gas left:", gasleft());
        SplitChainToken splitChainToken = new SplitChainToken();
        splitChainTokenAddress = address(splitChainToken);
        console.log("SplitChainToken deployed to:", splitChainTokenAddress);

        console.log("Deploying SplitChainCore, gas left:", gasleft());
        SplitChainCore splitChainCore = new SplitChainCore();
        splitChainCoreAddress = address(splitChainCore);
        console.log("SplitChainCore deployed to:", splitChainCoreAddress);

        console.log("Deploying SplitChainFactory, gas left:", gasleft());
        SplitChainFactory splitChainFactory = new SplitChainFactory();
        splitChainFactoryAddress = address(splitChainFactory);
        console.log("SplitChainFactory deployed to:", splitChainFactoryAddress);

        console.log("Stopping broadcast, gas left:", gasleft());
        vm.stopBroadcast();
    }
}