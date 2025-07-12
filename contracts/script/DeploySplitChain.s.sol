// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {SplitChainToken} from "../SplitChainToken.sol";
import {SplitChainCore} from "../SplitChainCore.sol";
import {SplitChainFactory} from "../SplitChainFactory.sol";
import {SplitChainMultiToken} from "../SplitChainMultiToken.sol";
import {SplitChainAnalytics} from "../SplitChainAnalytics.sol";

contract DeploySplitChainScript is Script {
    function run() external returns (SplitChainToken, SplitChainCore, SplitChainFactory, SplitChainMultiToken, SplitChainAnalytics) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy SplitChainToken
        SplitChainToken token = new SplitChainToken();
        console.log("SplitChainToken deployed to:", address(token));

        // Deploy SplitChainCore
        SplitChainCore core = new SplitChainCore();
        console.log("SplitChainCore deployed to:", address(core));

        // Deploy SplitChainFactory
        SplitChainFactory factory = new SplitChainFactory();
        console.log("SplitChainFactory deployed to:", address(factory));

        // Deploy SplitChainMultiToken
        SplitChainMultiToken multiToken = new SplitChainMultiToken();
        console.log("SplitChainMultiToken deployed to:", address(multiToken));

        // Deploy SplitChainAnalytics
        SplitChainAnalytics analytics = new SplitChainAnalytics(address(core));
        console.log("SplitChainAnalytics deployed to:", address(analytics));

        vm.stopBroadcast();

        return (token, core, factory, multiToken, analytics);
    }
}
