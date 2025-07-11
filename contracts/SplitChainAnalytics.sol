// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SplitChainCore.sol";

/**
 * @title SplitChainAnalytics
 * @dev Analytics and reporting contract for SplitChain data
 */
contract SplitChainAnalytics {
    SplitChainCore public immutable splitChainCore;
    
    struct GroupStats {
        uint256 totalExpenses;
        uint256 totalAmount;
        uint256 settledAmount;
        uint256 pendingAmount;
        uint256 memberCount;
        uint256 avgExpenseAmount;
        uint256 lastActivityTime;
    }
    
    struct UserStats {
        uint256 totalGroupsJoined;
        uint256 totalExpensesPaid;
        uint256 totalAmountPaid;
        uint256 totalAmountOwed;
        uint256 totalAmountSettled;
        uint256 avgSettlementTime;
    }
    
    constructor(address _splitChainCore) {
        splitChainCore = SplitChainCore(_splitChainCore);
    }
    
    function getGroupStats(uint256 groupId) external view returns (GroupStats memory) {
        (, , , address[] memory members, uint256 expenseCount, , ) = splitChainCore.getGroup(groupId);
        
        GroupStats memory stats;
        stats.memberCount = members.length;
        stats.totalExpenses = expenseCount;
        
        // Calculate other stats by iterating through expenses
        // Note: In production, you'd want to optimize this with events/indexing
        
        return stats;
    }
    
    function getUserStats(address user) external view returns (UserStats memory) {
        uint256[] memory userGroups = splitChainCore.getUserGroups(user);
        
        UserStats memory stats;
        stats.totalGroupsJoined = userGroups.length;
        
        // Calculate other stats
        for (uint256 i = 0; i < userGroups.length; i++) {
            int256 balance = splitChainCore.getUserBalance(userGroups[i], user);
            if (balance > 0) {
                stats.totalAmountOwed += uint256(balance);
            } else if (balance < 0) {
                stats.totalAmountPaid += uint256(-balance);
            }
        }
        
        return stats;
    }
    
    function getTopSpenders(uint256 groupId, uint256 limit) external view returns (address[] memory, uint256[] memory) {
        (, , , address[] memory members, , , ) = splitChainCore.getGroup(groupId);
        
        address[] memory topSpenders = new address[](limit);
        uint256[] memory amounts = new uint256[](limit);
        
        // Simple sorting algorithm - in production, use more efficient approach
        for (uint256 i = 0; i < members.length && i < limit; i++) {
            int256 balance = splitChainCore.getUserBalance(groupId, members[i]);
            if (balance > 0) {
                topSpenders[i] = members[i];
                amounts[i] = uint256(balance);
            }
        }
        
        return (topSpenders, amounts);
    }
    
    function getSettlementRate(uint256 groupId) external view returns (uint256) {
        // Calculate percentage of settled vs total expenses
        // Implementation would track settlement events
        return 85; // Placeholder
    }
}
