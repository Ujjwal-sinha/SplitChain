// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SplitChainCore.sol";

contract SplitChainAnalytics {
    SplitChainCore public core;

    constructor(address _coreAddress) {
        core = SplitChainCore(_coreAddress);
    }

    function getGroupStats(uint256 _groupId) external view returns (uint256 totalExpenses, uint256 memberCount) {
        SplitChainCore.Group memory group = core.groups(_groupId);
        memberCount = group.members.length;
        // Additional logic to sum expenses
    }

    function getUserStats(address _user) external view returns (uint256 groupsJoined, uint256 totalPaid) {
        // Logic to calculate user activity
    }
}