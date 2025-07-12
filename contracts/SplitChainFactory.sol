// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SplitChainCore.sol";

contract SplitChainFactory {
    address[] public deployedContracts;
    
    event NewCoreDeployed(address indexed coreAddress, address indexed owner);
    
    function deployCore(uint256 _platformFeeBP) external returns (address) {
        SplitChainCore newCore = new SplitChainCore(_platformFeeBP);
        newCore.transferOwnership(msg.sender);
        deployedContracts.push(address(newCore));
        emit NewCoreDeployed(address(newCore), msg.sender);
        return address(newCore);
    }
    
    function getDeployedContracts() external view returns (address[] memory) {
        return deployedContracts;
    }
}