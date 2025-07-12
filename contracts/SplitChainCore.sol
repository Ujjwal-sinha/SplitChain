// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SplitChainCore
 * @dev Core contract for decentralized expense sharing on BlockDAG
 */
contract SplitChainCore is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Events
    event GroupCreated(uint256 indexed groupId, address indexed creator, string name);
    event MemberAdded(uint256 indexed groupId, address indexed member);
    event MemberRemoved(uint256 indexed groupId, address indexed member);
    event ExpenseAdded(uint256 indexed groupId, uint256 indexed expenseId, address indexed payer, uint256 amount);
    event ExpenseSettled(uint256 indexed groupId, uint256 indexed expenseId, address indexed settler, uint256 amount);
    event DebtSettled(uint256 indexed groupId, address indexed debtor, address indexed creditor, uint256 amount);

    // Structs
    struct Group {
        uint256 id;
        string name;
        address creator;
        address[] members;
        mapping(address => bool) isMember;
        mapping(address => uint256) memberIndex;
        uint256 expenseCount;
        bool isActive;
        uint256 createdAt;
    }

    struct Expense {
        uint256 id;
        uint256 groupId;
        string description;
        uint256 totalAmount;
        address payer;
        address[] participants;
        mapping(address => uint256) shares;
        mapping(address => bool) hasSettled;
        address tokenAddress; // address(0) for ETH
        uint256 createdAt;
        bool isSettled;
    }

    struct Balance {
        mapping(address => int256) balances; // positive = owed to user, negative = user owes
    }

    // State variables
    uint256 public groupCounter;
    uint256 public expenseCounter;
    
    mapping(uint256 => Group) public groups;
    mapping(uint256 => Expense) public expenses;
    mapping(uint256 => Balance) internal groupBalances; // Changed from public to internal
    mapping(address => uint256[]) public userGroups;
    
    // Platform fee (in basis points, 100 = 1%)
    uint256 public platformFee = 50; // 0.5%
    address public feeRecipient;

    constructor() {
        feeRecipient = msg.sender;
    }

    // Modifiers
    modifier onlyGroupMember(uint256 groupId) {
        require(groups[groupId].isMember[msg.sender], "Not a group member");
        _;
    }

    modifier groupExists(uint256 groupId) {
        require(groups[groupId].id != 0, "Group does not exist");
        _;
    }

    modifier expenseExists(uint256 expenseId) {
        require(expenses[expenseId].id != 0, "Expense does not exist");
        _;
    }

    // Group Management Functions
    function createGroup(string memory name, address[] memory initialMembers) external returns (uint256) {
        require(bytes(name).length > 0, "Group name cannot be empty");
        
        groupCounter++;
        uint256 groupId = groupCounter;
        
        Group storage newGroup = groups[groupId];
        newGroup.id = groupId;
        newGroup.name = name;
        newGroup.creator = msg.sender;
        newGroup.isActive = true;
        newGroup.createdAt = block.timestamp;
        
        // Add creator as first member
        _addMemberToGroup(groupId, msg.sender);
        
        // Add initial members
        for (uint256 i = 0; i < initialMembers.length; i++) {
            if (initialMembers[i] != msg.sender && initialMembers[i] != address(0)) {
                _addMemberToGroup(groupId, initialMembers[i]);
            }
        }
        
        emit GroupCreated(groupId, msg.sender, name);
        return groupId;
    }

    function addMember(uint256 groupId, address member) external groupExists(groupId) onlyGroupMember(groupId) {
        require(member != address(0), "Invalid member address");
        require(!groups[groupId].isMember[member], "Already a member");
        
        _addMemberToGroup(groupId, member);
        emit MemberAdded(groupId, member);
    }

    function removeMember(uint256 groupId, address member) external groupExists(groupId) {
        require(
            msg.sender == groups[groupId].creator || msg.sender == member,
            "Only creator or member can remove"
        );
        require(groups[groupId].isMember[member], "Not a member");
        
        _removeMemberFromGroup(groupId, member);
        emit MemberRemoved(groupId, member);
    }

    function _addMemberToGroup(uint256 groupId, address member) internal {
        Group storage group = groups[groupId];
        group.members.push(member);
        group.isMember[member] = true;
        group.memberIndex[member] = group.members.length - 1;
        userGroups[member].push(groupId);
    }

    function _removeMemberFromGroup(uint256 groupId, address member) internal {
        Group storage group = groups[groupId];
        uint256 index = group.memberIndex[member];
        uint256 lastIndex = group.members.length - 1;
        
        if (index != lastIndex) {
            address lastMember = group.members[lastIndex];
            group.members[index] = lastMember;
            group.memberIndex[lastMember] = index;
        }
        
        group.members.pop();
        delete group.isMember[member];
        delete group.memberIndex[member];
        
        // Remove from user groups
        uint256[] storage userGroupList = userGroups[member];
        for (uint256 i = 0; i < userGroupList.length; i++) {
            if (userGroupList[i] == groupId) {
                userGroupList[i] = userGroupList[userGroupList.length - 1];
                userGroupList.pop();
                break;
            }
        }
    }

    // Expense Management Functions
    function addExpense(
        uint256 groupId,
        string memory description,
        uint256 totalAmount,
        address[] memory participants,
        uint256[] memory shares,
        address tokenAddress
    ) external payable groupExists(groupId) onlyGroupMember(groupId) nonReentrant {
        require(bytes(description).length > 0, "Description cannot be empty");
        require(totalAmount > 0, "Amount must be greater than 0");
        require(participants.length > 0, "Must have participants");
        require(participants.length == shares.length, "Participants and shares length mismatch");
        
        // Validate all participants are group members
        for (uint256 i = 0; i < participants.length; i++) {
            require(groups[groupId].isMember[participants[i]], "Participant not in group");
        }
        
        // Validate shares sum to total amount
        uint256 sharesSum = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            sharesSum += shares[i];
        }
        require(sharesSum == totalAmount, "Shares must sum to total amount");
        
        expenseCounter++;
        uint256 expenseId = expenseCounter;
        
        Expense storage newExpense = expenses[expenseId];
        newExpense.id = expenseId;
        newExpense.groupId = groupId;
        newExpense.description = description;
        newExpense.totalAmount = totalAmount;
        newExpense.payer = msg.sender;
        newExpense.participants = participants;
        newExpense.tokenAddress = tokenAddress;
        newExpense.createdAt = block.timestamp;
        
        // Set individual shares
        for (uint256 i = 0; i < participants.length; i++) {
            newExpense.shares[participants[i]] = shares[i];
        }
        
        // Handle payment
        if (tokenAddress == address(0)) {
            // ETH payment
            require(msg.value == totalAmount, "Incorrect ETH amount");
        } else {
            // ERC20 payment
            require(msg.value == 0, "ETH not accepted for token payments");
            IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), totalAmount);
        }
        
        // Update balances
        _updateBalancesForExpense(groupId, expenseId);
        
        groups[groupId].expenseCount++;
        
        emit ExpenseAdded(groupId, expenseId, msg.sender, totalAmount);
    }

    function _updateBalancesForExpense(uint256 groupId, uint256 expenseId) internal {
        Expense storage expense = expenses[expenseId];
        Balance storage balance = groupBalances[groupId];
        
        // Payer gets credited for the full amount
        balance.balances[expense.payer] += int256(expense.totalAmount);
        
        // Each participant gets debited for their share
        for (uint256 i = 0; i < expense.participants.length; i++) {
            address participant = expense.participants[i];
            uint256 share = expense.shares[participant];
            balance.balances[participant] -= int256(share);
        }
    }

    // Settlement Functions
    function settleDebt(uint256 groupId, address creditor, uint256 amount, address tokenAddress) 
        external payable groupExists(groupId) onlyGroupMember(groupId) nonReentrant {
        require(creditor != msg.sender, "Cannot settle with yourself");
        require(groups[groupId].isMember[creditor], "Creditor not in group");
        require(amount > 0, "Amount must be greater than 0");
        
        Balance storage balance = groupBalances[groupId];
        
        // Check if debtor actually owes money to creditor
        int256 debtorBalance = balance.balances[msg.sender];
        int256 creditorBalance = balance.balances[creditor];
        
        require(debtorBalance < 0, "You don't owe money");
        require(creditorBalance > 0, "Creditor is not owed money");
        
        uint256 maxSettlement = uint256(-debtorBalance) < uint256(creditorBalance) 
            ? uint256(-debtorBalance) 
            : uint256(creditorBalance);
        
        require(amount <= maxSettlement, "Settlement amount too high");
        
        // Calculate platform fee
        uint256 fee = (amount * platformFee) / 10000;
        uint256 netAmount = amount - fee;
        
        // Handle payment
        if (tokenAddress == address(0)) {
            // ETH payment
            require(msg.value == amount, "Incorrect ETH amount");
            payable(creditor).transfer(netAmount);
            if (fee > 0) {
                payable(feeRecipient).transfer(fee);
            }
        } else {
            // ERC20 payment
            require(msg.value == 0, "ETH not accepted for token payments");
            IERC20 token = IERC20(tokenAddress);
            token.safeTransferFrom(msg.sender, creditor, netAmount);
            if (fee > 0) {
                token.safeTransferFrom(msg.sender, feeRecipient, fee);
            }
        }
        
        // Update balances
        balance.balances[msg.sender] += int256(amount);
        balance.balances[creditor] -= int256(amount);
        
        emit DebtSettled(groupId, msg.sender, creditor, amount);
    }

    // View Functions
    function getGroup(uint256 groupId) external view returns (
        uint256 id,
        string memory name,
        address creator,
        address[] memory members,
        uint256 expenseCount,
        bool isActive,
        uint256 createdAt
    ) {
        Group storage group = groups[groupId];
        return (
            group.id,
            group.name,
            group.creator,
            group.members,
            group.expenseCount,
            group.isActive,
            group.createdAt
        );
    }

    function getExpense(uint256 expenseId) external view returns (
        uint256 id,
        uint256 groupId,
        string memory description,
        uint256 totalAmount,
        address payer,
        address[] memory participants,
        address tokenAddress,
        uint256 createdAt,
        bool isSettled
    ) {
        Expense storage expense = expenses[expenseId];
        return (
            expense.id,
            expense.groupId,
            expense.description,
            expense.totalAmount,
            expense.payer,
            expense.participants,
            expense.tokenAddress,
            expense.createdAt,
            expense.isSettled
        );
    }

    function getExpenseShare(uint256 expenseId, address participant) external view returns (uint256) {
        return expenses[expenseId].shares[participant];
    }

    function getUserBalance(uint256 groupId, address user) external view returns (int256) {
        return groupBalances[groupId].balances[user];
    }

    function getUserGroups(address user) external view returns (uint256[] memory) {
        return userGroups[user];
    }

    function getGroupMembers(uint256 groupId) external view returns (address[] memory) {
        return groups[groupId].members;
    }

    // Admin Functions
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFee = newFee;
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
    }

    // Emergency Functions
    function emergencyWithdraw(address tokenAddress) external onlyOwner {
        if (tokenAddress == address(0)) {
            payable(owner()).transfer(address(this).balance);
        } else {
            IERC20 token = IERC20(tokenAddress);
            token.safeTransfer(owner(), token.balanceOf(address(this)));
        }
    }
}
