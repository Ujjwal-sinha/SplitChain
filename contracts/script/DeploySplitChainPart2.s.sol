// script/DeploySplitChainPart2.s.sol
pragma solidity ^0.8.19;
import {console} from "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {SplitChainAnalytics} from "../SplitChainAnalytics.sol";
import {SplitChainMultiToken} from "../SplitChainMultiToken.sol";
import {SplitChainGovernance} from "../SplitChainGovernance.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

contract DeploySplitChainPart2 is Script {
    function run(address splitChainCoreAddress, address splitChainTokenAddress) external returns (address splitChainAnalyticsAddress, address splitChainMultiTokenAddress, address splitChainGovernanceAddress) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        console.log("Starting broadcast, gas left:", gasleft());
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying SplitChainAnalytics, gas left:", gasleft());
        SplitChainAnalytics splitChainAnalytics = new SplitChainAnalytics(splitChainCoreAddress);
        splitChainAnalyticsAddress = address(splitChainAnalytics);
        console.log("SplitChainAnalytics deployed to:", splitChainAnalyticsAddress);

        console.log("Deploying SplitChainMultiToken, gas left:", gasleft());
        SplitChainMultiToken splitChainMultiToken = new SplitChainMultiToken();
        splitChainMultiTokenAddress = address(splitChainMultiToken);
        console.log("SplitChainMultiToken deployed to:", splitChainMultiTokenAddress);

        console.log("Deploying TimelockController, gas left:", gasleft());
        address[] memory proposers = new address[](1);
        proposers[0] = address(this); // Deployer as proposer
        address[] memory executors = new address[](1);
        executors[0] = address(this); // Deployer as executor
        TimelockController timelockController = new TimelockController(2 days, proposers, executors);
        address timelockControllerAddress = address(timelockController);
        console.log("TimelockController deployed to:", timelockControllerAddress);

        console.log("Deploying SplitChainGovernance, gas left:", gasleft());
        SplitChainGovernance splitChainGovernance = new SplitChainGovernance(SplitChainToken(splitChainTokenAddress), timelockController);
        splitChainGovernanceAddress = address(splitChainGovernance);
        console.log("SplitChainGovernance deployed to:", splitChainGovernanceAddress);

        console.log("Stopping broadcast, gas left:", gasleft());
        vm.stopBroadcast();
    }
}