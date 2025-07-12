// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SplitChainCore is Ownable, ReentrancyGuard {
    // Structs
    struct Group {
        string name;
        address[] members;
        uint256 nextExpenseId;
        mapping(uint256 => Expense) expenses;
        mapping(address => mapping(address => int256)) balances; // owedBy => owesTo => amount
    }

    struct Expense {
        uint256 id;
        string description;
        address payer;
        uint256 amount; // Total amount of the expense
        address tokenAddress; // 0x0 for native currency, otherwise ERC20 token address
        mapping(address => uint256) shares; // member => share amount
        address[] participants; // List of participants for iteration
        bool settled;
    }

    struct Balance {
        mapping(address => int256) owedBy; // user => amount owed by this user to others
        mapping(address => int256) owesTo; // user => amount this user owes to others
    }

    // State variables
    uint256 public nextGroupId;
    mapping(uint256 => Group) public groups;
    mapping(address => uint256[]) public userGroups; // user => list of group IDs they are part of

    // Platform fee
    uint256 public platformFeeBasisPoints; // e.g., 100 = 1%
    address public feeRecipient;

    // Events
    event GroupCreated(uint256 indexed groupId, string name, address indexed creator);
    event MemberAdded(uint256 indexed groupId, address indexed member);
    event MemberRemoved(uint256 indexed groupId, address indexed member);
    event ExpenseAdded(uint256 indexed groupId, uint256 indexed expenseId, string description, address indexed payer, uint256 amount, address tokenAddress);
    event DebtSettled(uint256 indexed groupId, address indexed payer, address indexed receiver, uint256 amount, address tokenAddress, uint256 feeAmount);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);

    constructor(uint256 _initialFeeBasisPoints, address _initialFeeRecipient) Ownable(msg.sender) {
        require(_initialFeeBasisPoints <= 10000, "Fee cannot exceed 100%");
        platformFeeBasisPoints = _initialFeeBasisPoints;
        feeRecipient = _initialFeeRecipient;
        nextGroupId = 1;
    }

    // Modifier to check if a user is a member of a group
    modifier onlyGroupMember(uint256 _groupId, address _member) {
        bool isMember = false;
        for (uint256 i = 0; i < groups[_groupId].members.length; i++) {
            if (groups[_groupId].members[i] == _member) {
                isMember = true;
                break;
            }
        }
        require(isMember, "Not a member of this group");
        _;
    }

    // Admin functions
    function updatePlatformFee(uint256 _newFeeBasisPoints) public onlyOwner {
        require(_newFeeBasisPoints <= 10000, "Fee cannot exceed 100%");
        emit PlatformFeeUpdated(platformFeeBasisPoints, _newFeeBasisPoints);
        platformFeeBasisPoints = _newFeeBasisPoints;
    }

    function updateFeeRecipient(address _newRecipient) public onlyOwner {
        require(_newRecipient != address(0), "Invalid recipient address");
        emit FeeRecipientUpdated(feeRecipient, _newRecipient);
        feeRecipient = _newRecipient;
    }

    // Group management
    function createGroup(string memory _name) public returns (uint256) {
        uint256 groupId = nextGroupId++;
        Group storage newGroup = groups[groupId];
        newGroup.name = _name;
        newGroup.nextExpenseId = 1;
        newGroup.members.push(msg.sender);
        userGroups[msg.sender].push(groupId);
        emit GroupCreated(groupId, _name, msg.sender);
        return groupId;
    }

    function addMember(uint256 _groupId, address _member) public onlyGroupMember(_groupId, msg.sender) {
        Group storage group = groups[_groupId];
        for (uint256 i = 0; i < group.members.length; i++) {
            require(group.members[i] != _member, "Member already in group");
        }
        group.members.push(_member);
        userGroups[_member].push(_groupId);
        emit MemberAdded(_groupId, _member);
    }

    function removeMember(uint256 _groupId, address _member) public onlyGroupMember(_groupId, msg.sender) {
        Group storage group = groups[_groupId];
        require(group.members.length > 1, "Cannot remove the only member");
        require(_member != msg.sender, "Cannot remove yourself directly, use leaveGroup"); // Prevent self-removal via this function

        bool found = false;
        for (uint256 i = 0; i < group.members.length; i++) {
            if (group.members[i] == _member) {
                group.members[i] = group.members[group.members.length - 1];
                group.members.pop();
                found = true;
                break;
            }
        }
        require(found, "Member not found in group");

        // Remove group from user's list
        for (uint256 i = 0; i < userGroups[_member].length; i++) {
            if (userGroups[_member][i] == _groupId) {
                userGroups[_member][i] = userGroups[_member][userGroups[_member].length - 1];
                userGroups[_member].pop();
                break;
            }
        }
        emit MemberRemoved(_groupId, _member);
    }

    function leaveGroup(uint256 _groupId) public onlyGroupMember(_groupId, msg.sender) {
        Group storage group = groups[_groupId];
        require(group.members.length > 1, "Cannot leave the only member in a group");

        // Remove member from group's list
        bool found = false;
        for (uint256 i = 0; i < group.members.length; i++) {
            if (group.members[i] == msg.sender) {
                group.members[i] = group.members[group.members.length - 1];
                group.members.pop();
                found = true;
                break;
            }
        }
        require(found, "Caller not found in group");

        // Remove group from user's list
        for (uint256 i = 0; i < userGroups[msg.sender].length; i++) {
            if (userGroups[msg.sender][i] == _groupId) {
                userGroups[msg.sender][i] = userGroups[msg.sender][userGroups[msg.sender].length - 1];
                userGroups[msg.sender].pop();
                break;
            }
        }
        emit MemberRemoved(_groupId, msg.sender);
    }

    // Expense management
    function addExpense(
        uint256 _groupId,
        string memory _description,
        address _payer,
        uint256 _totalAmount,
        address _tokenAddress, // 0x0 for native currency
        address[] memory _participants,
        uint256[] memory _shares // shares for each participant
    ) public onlyGroupMember(_groupId, msg.sender) {
        require(_payer != address(0), "Invalid payer address");
        require(_participants.length == _shares.length, "Participants and shares mismatch");
        require(_totalAmount > 0, "Expense amount must be greater than 0");

        uint256 sumShares = 0;
        for (uint256 i = 0; i < _shares.length; i++) {
            require(groups[_groupId].members.length > 0, "Group has no members"); // Ensure group has members
            bool isParticipantMember = false;
            for (uint256 j = 0; j < groups[_groupId].members.length; j++) {
                if (groups[_groupId].members[j] == _participants[i]) {
                    isParticipantMember = true;
                    break;
                }
            }
            require(isParticipantMember, "Participant is not a member of the group");
            sumShares += _shares[i];
        }
        require(sumShares == _totalAmount, "Sum of shares must equal total amount");

        Group storage group = groups[_groupId];
        uint256 expenseId = group.nextExpenseId++;
        Expense storage newExpense = group.expenses[expenseId];

        newExpense.id = expenseId;
        newExpense.description = _description;
        newExpense.payer = _payer;
        newExpense.amount = _totalAmount;
        newExpense.tokenAddress = _tokenAddress;
        newExpense.participants = _participants;
        newExpense.settled = false;

        // Update balances
        for (uint256 i = 0; i < _participants.length; i++) {
            address participant = _participants[i];
            uint256 share = _shares[i];

            newExpense.shares[participant] = share;

            if (participant != _payer) {
                // Participant owes payer
                group.balances[_payer][participant] += int252(share);
                group.balances[participant][_payer] -= int252(share);
            }
        }

        emit ExpenseAdded(_groupId, expenseId, _description, _payer, _totalAmount, _tokenAddress);
    }

    // Debt settlement
    function settleDebt(
        uint256 _groupId,
        address _receiver,
        uint256 _amount,
        address _tokenAddress // 0x0 for native currency
    ) public payable nonReentrant onlyGroupMember(_groupId, msg.sender) {
        require(_receiver != address(0), "Invalid receiver address");
        require(_receiver != msg.sender, "Cannot settle debt with yourself");
        require(_amount > 0, "Amount must be greater than 0");

        Group storage group = groups[_groupId];
        int256 currentDebt = group.balances[msg.sender][_receiver];
        require(currentDebt < 0, "No debt owed to this receiver");
        require(uint256(-currentDebt) >= _amount, "Amount exceeds current debt");

        uint256 feeAmount = (_amount * platformFeeBasisPoints) / 10000;
        uint256 amountToReceiver = _amount - feeAmount;

        if (_tokenAddress == address(0)) {
            // Native currency (ETH/BDAG)
            require(msg.value == _amount, "Incorrect native currency amount sent");
            (bool successFee, ) = payable(feeRecipient).call{value: feeAmount}("");
            require(successFee, "Failed to send fee");
            (bool successReceiver, ) = payable(_receiver).call{value: amountToReceiver}("");
            require(successReceiver, "Failed to send to receiver");
        } else {
            // ERC20 token
            IERC20 token = IERC20(_tokenAddress);
            require(token.transferFrom(msg.sender, feeRecipient, feeAmount), "Failed to transfer fee token");
            require(token.transferFrom(msg.sender, _receiver, amountToReceiver), "Failed to transfer token to receiver");
        }

        // Update balances
        group.balances[msg.sender][_receiver] += int252(_amount);
        group.balances[_receiver][msg.sender] -= int252(_amount);

        emit DebtSettled(_groupId, msg.sender, _receiver, _amount, _tokenAddress, feeAmount);
    }

    // View functions
    function getGroupDetails(uint256 _groupId) public view returns (string memory name, address[] memory members, uint256 nextExpenseId) {
        Group storage group = groups[_groupId];
        return (group.name, group.members, group.nextExpenseId);
    }

    function getGroupMembers(uint256 _groupId) public view returns (address[] memory) {
        return groups[_groupId].members;
    }

    function getExpenseDetails(uint256 _groupId, uint256 _expenseId) public view returns (
        uint256 id,
        string memory description,
        address payer,
        uint256 amount,
        address tokenAddress,
        address[] memory participants,
        bool settled
    ) {
        Group storage group = groups[_groupId];
        Expense storage expense = group.expenses[_expenseId];
        return (expense.id, expense.description, expense.payer, expense.amount, expense.tokenAddress, expense.participants, expense.settled);
    }

    function getExpenseShare(uint256 _groupId, uint256 _expenseId, address _member) public view returns (uint256) {
        return groups[_groupId].expenses[_expenseId].shares[_member];
    }

    function getUserBalance(uint256 _groupId, address _userA, address _userB) public view returns (int256) {
        return groups[_groupId].balances[_userA][_userB];
    }

    function getUserGroups(address _user) public view returns (uint256[] memory) {
        return userGroups[_user];
    }
}
