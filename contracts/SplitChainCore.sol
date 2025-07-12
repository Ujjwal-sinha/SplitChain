// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SplitChainCore is Ownable, ReentrancyGuard {
    struct Group {
        address creator;
        string name;
        address[] members;
    }

    struct Expense {
        address payer;
        uint256 amount;
        address token; // address(0) for ETH/BDAG
        string description;
    }

    struct Balance {
        address debtor;
        address creditor;
        uint256 amount;
    }

    uint256 public platformFee; // Fee in BDAG
    Group[] public groups;
    Expense[] public expenses;
    Balance[] public balances;

    event GroupCreated(uint256 groupId, address creator);
    event ExpenseAdded(uint256 expenseId, address payer, uint256 amount);
    event Settlement(address debtor, address creditor, uint256 amount);

    constructor(uint256 _platformFee) Ownable(msg.sender) {
        platformFee = _platformFee;
    }

    function createGroup(string memory _name, address[] memory _members) external {
        groups.push(Group(msg.sender, _name, _members));
        emit GroupCreated(groups.length - 1, msg.sender);
    }

    function addExpense(uint256 _groupId, uint256 _amount, address _token, string memory _description) external nonReentrant {
        expenses.push(Expense(msg.sender, _amount, _token, _description));
        emit ExpenseAdded(expenses.length - 1, msg.sender, _amount);
    }

    function settleDebt(address _debtor, address _creditor, uint256 _amount) external payable nonReentrant {
        require(msg.value >= _amount + platformFee, "Insufficient funds");
        balances.push(Balance(_debtor, _creditor, _amount));
        emit Settlement(_debtor, _creditor, _amount);
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}