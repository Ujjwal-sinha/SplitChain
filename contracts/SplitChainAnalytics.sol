// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SplitChainCore.sol";

contract SplitChainAnalytics {
    SplitChainCore public immutable core;
    
    constructor(address _coreAddress) {
        core = SplitChainCore(_coreAddress);
    }
    
    function getGroupStats(uint256 _groupId) external view returns (
        uint256 memberCount,
        uint256 totalExpenses,
        uint256 activeDebts
    ) {
        // Implementation would use core's public getters
        return (0, 0, 0);
    }
    
    function getUserStats(address _user) external view returns (
        uint256 groupsJoined,
        uint256 totalOwed,
        uint256 totalCredit
    ) {
        // Implementation would use core's public getters
        return (0, 0, 0);
    }
}