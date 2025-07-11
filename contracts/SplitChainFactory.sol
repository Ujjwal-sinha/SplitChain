// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SplitChainCore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SplitChainFactory
 * @dev Factory contract for deploying SplitChain instances
 */
contract SplitChainFactory is Ownable {
    event SplitChainDeployed(address indexed instance, address indexed deployer);
    
    address[] public deployedInstances;
    mapping(address => address[]) public userInstances;
    
    function deploySplitChain() external returns (address) {
        SplitChainCore newInstance = new SplitChainCore();
        newInstance.transferOwnership(msg.sender);
        
        address instanceAddress = address(newInstance);
        deployedInstances.push(instanceAddress);
        userInstances[msg.sender].push(instanceAddress);
        
        emit SplitChainDeployed(instanceAddress, msg.sender);
        return instanceAddress;
    }
    
    function getDeployedInstances() external view returns (address[] memory) {
        return deployedInstances;
    }
    
    function getUserInstances(address user) external view returns (address[] memory) {
        return userInstances[user];
    }
    
    function getInstanceCount() external view returns (uint256) {
        return deployedInstances.length;
    }
}
