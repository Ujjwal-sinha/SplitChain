// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {console} from "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {SplitChainToken} from "../SplitChainToken.sol";
import {SplitChainCore} from "../SplitChainCore.sol";
import {SplitChainFactory} from "../SplitChainFactory.sol";
import {SplitChainAnalytics} from "../SplitChainAnalytics.sol";
import {SplitChainMultiToken} from "../SplitChainMultiToken.sol";
// import {SplitChainGovernance} from "../SplitChainGovernance.sol"; // Uncomment if deploying governance

contract DeploySplitChainScript is Script {
    function run() external returns (address splitChainTokenAddress, address splitChainCoreAddress, address splitChainFactoryAddress, address splitChainAnalyticsAddress, address splitChainMultiTokenAddress) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy SplitChainToken
        SplitChainToken splitChainToken = new SplitChainToken();
        splitChainTokenAddress = address(splitChainToken);
        console.log("SplitChainToken deployed to:", splitChainTokenAddress);

        // Deploy SplitChainCore
        SplitChainCore splitChainCore = new SplitChainCore();
        splitChainCoreAddress = address(splitChainCore);
        console.log("SplitChainCore deployed to:", splitChainCoreAddress);

        // Deploy SplitChainFactory
        SplitChainFactory splitChainFactory = new SplitChainFactory();
        splitChainFactoryAddress = address(splitChainFactory);
        console.log("SplitChainFactory deployed to:", splitChainFactoryAddress);

        // Deploy SplitChainAnalytics (requires SplitChainCore address)
        SplitChainAnalytics splitChainAnalytics = new SplitChainAnalytics(splitChainCoreAddress);
        splitChainAnalyticsAddress = address(splitChainAnalytics);
        console.log("SplitChainAnalytics deployed to:", splitChainAnalyticsAddress);

        // Deploy SplitChainMultiToken
        SplitChainMultiToken splitChainMultiToken = new SplitChainMultiToken();
        splitChainMultiTokenAddress = address(splitChainMultiToken);
        console.log("SplitChainMultiToken deployed to:", splitChainMultiTokenAddress);

        // Deploy SplitChainGovernance (requires SplitChainToken and TimelockController)
        // This part is commented out as TimelockController is not deployed here.
        // You would need to deploy TimelockController first and then pass its address.
        // SplitChainGovernance splitChainGovernance = new SplitChainGovernance(splitChainTokenAddress, timelockControllerAddress);
        // console.log("SplitChainGovernance deployed to:", address(splitChainGovernance));

        vm.stopBroadcast();
    }
}
