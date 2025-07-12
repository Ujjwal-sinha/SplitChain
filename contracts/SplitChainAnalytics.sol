// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SplitChainCore.sol";

contract SplitChainAnalytics is Ownable {
    SplitChainCore public splitChainCore;

    constructor(address _splitChainCoreAddress) Ownable(msg.sender) {
        require(_splitChainCoreAddress != address(0), "Invalid SplitChainCore address");
        splitChainCore = SplitChainCore(_splitChainCoreAddress);
    }

    /**
     * @dev Returns basic statistics for a given group.
     * @param _groupId The ID of the group.
     * @return totalExpenses The sum of all expenses in the group.
     * @return memberCount The number of members in the group.
     * @return expenseCount The total number of expenses recorded in the group.
     */
    function getGroupStats(uint256 _groupId)
        public
        view
        returns (
            uint256 totalExpenses,
            uint256 memberCount,
            uint256 expenseCount
        )
    {
        (, address[] memory members, uint256 nextExpenseId) = splitChainCore.getGroupDetails(_groupId);
        memberCount = members.length;
        expenseCount = nextExpenseId - 1; // nextExpenseId is 1-based, so count is nextExpenseId - 1

        // This part is tricky as SplitChainCore's expense mapping is private.
        // To get total expenses, SplitChainCore would need a public view function
        // that iterates through its expenses or maintains a running total.
        // For now, we'll return 0 for totalExpenses as it's not directly accessible.
        // If SplitChainCore were to expose a way to iterate expenses or a running total,
        // this function could be updated.
        totalExpenses = 0; // Placeholder, needs SplitChainCore update to be accurate
    }

    /**
     * @dev Returns statistics for a specific user across all their groups.
     * @param _user The address of the user.
     * @return totalGroupsJoined The number of groups the user is part of.
     * @return totalAmountPaid The total amount the user has paid across all expenses (placeholder).
     * @return totalAmountOwed The total amount the user owes across all expenses (placeholder).
     */
    function getUserStats(address _user)
        public
        view
        returns (
            uint256 totalGroupsJoined,
            uint256 totalAmountPaid,
            uint256 totalAmountOwed
        )
    {
        uint256[] memory userGroups = splitChainCore.getUserGroups(_user);
        totalGroupsJoined = userGroups.length;

        // These require iterating through all expenses in all user's groups,
        // which is gas-intensive for a view function if not optimized.
        // SplitChainCore would need to expose more granular data or aggregate it.
        totalAmountPaid = 0; // Placeholder
        totalAmountOwed = 0; // Placeholder
    }

    /**
     * @dev Identifies the top N spenders in a given group.
     * This is a complex operation for a view function if not optimized in SplitChainCore.
     * @param _groupId The ID of the group.
     * @param _n The number of top spenders to return.
     * @return topSpenders A list of addresses of the top spenders.
     * @return amountsSpent A list of amounts spent by the top spenders.
     */
    function getTopSpenders(uint256 _groupId, uint256 _n)
        public
        view
        returns (address[] memory topSpenders, uint256[] memory amountsSpent)
    {
        // This would require iterating through all expenses and aggregating payer amounts,
        // which is not directly supported by SplitChainCore's current public interface.
        // Placeholder implementation.
        _n; // To avoid "unused parameter" warning
        topSpenders = new address[](0);
        amountsSpent = new uint256[](0);
    }

    /**
     * @dev Calculates the settlement rate for a group (e.g., percentage of debts settled).
     * This requires access to all balances and settled expenses, which is not directly exposed.
     * @param _groupId The ID of the group.
     * @return settlementRate The calculated settlement rate (e.g., 0-100).
     */
    function getSettlementRate(uint256 _groupId) public view returns (uint256 settlementRate) {
        _groupId; // To avoid "unused parameter" warning
        // Placeholder, needs more data from SplitChainCore
        return 0;
    }
}
