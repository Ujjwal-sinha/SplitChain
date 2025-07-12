// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SplitChainCore.sol";

contract SplitChainFactory {
    address[] public deployedContracts;
    mapping(address => address) public ownerOfContract;

    event NewSplitChainDeployed(address indexed contractAddress, address indexed owner);

    function deploySplitChain(uint256 _platformFee) external returns (address) {
        SplitChainCore newSplitChain = new SplitChainCore(_platformFee);
        deployedContracts.push(address(newSplitChain));
        ownerOfContract[address(newSplitChain)] = msg.sender;
        emit NewSplitChainDeployed(address(newSplitChain), msg.sender);
        return address(newSplitChain);
    }
}