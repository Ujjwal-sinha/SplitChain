// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SplitChainCore.sol";

contract SplitChainFactory is Ownable {
    // Mapping to keep track of deployed SplitChainCore instances
    mapping(uint256 => address) public deployedSplitChainCores;
    mapping(address => uint256) public creatorToGroupId; // Maps creator to the groupId they deployed

    event SplitChainCoreDeployed(uint256 indexed groupId, address indexed coreAddress, address indexed creator);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Deploys a new SplitChainCore contract and transfers its ownership to the caller.
     * @param _initialFeeBasisPoints The initial platform fee in basis points (e.g., 100 for 1%).
     * @param _initialFeeRecipient The initial address to receive platform fees.
     * @return The address of the newly deployed SplitChainCore contract.
     */
    function deploySplitChain(uint256 _initialFeeBasisPoints, address _initialFeeRecipient) public returns (address) {
        // Create a new instance of SplitChainCore
        SplitChainCore newCore = new SplitChainCore(_initialFeeBasisPoints, _initialFeeRecipient);

        // Transfer ownership of the new SplitChainCore to the caller (msg.sender)
        // The constructor of SplitChainCore already sets msg.sender as owner.
        // If you want the factory to own it initially and then transfer, you'd do:
        // newCore.transferOwnership(msg.sender);

        // Store the deployed address
        uint256 newGroupId = newCore.createGroup("Default Group"); // Create a default group for the creator
        deployedSplitChainCores[newGroupId] = address(newCore);
        creatorToGroupId[msg.sender] = newGroupId; // Assuming one core per creator for simplicity here

        emit SplitChainCoreDeployed(newGroupId, address(newCore), msg.sender);

        return address(newCore);
    }

    /**
     * @dev Returns the address of a deployed SplitChainCore contract by its group ID.
     * @param _groupId The ID of the group associated with the SplitChainCore contract.
     * @return The address of the SplitChainCore contract.
     */
    function getSplitChainCoreAddress(uint256 _groupId) public view returns (address) {
        return deployedSplitChainCores[_groupId];
    }
}
