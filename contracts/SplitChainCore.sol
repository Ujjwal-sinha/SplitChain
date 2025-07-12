// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SplitChainCore is Ownable2Step, ReentrancyGuard {
    struct Group {
        address creator;
        string name;
        address[] members;
        mapping(address => bool) isMember;
        mapping(address => int256) balances;
    }

    uint256 public platformFeeBP; // Basis points (1% = 100)
    Group[] private groups;

    event GroupCreated(uint256 indexed groupId, address creator);
    event ExpenseAdded(uint256 indexed groupId, address payer, uint256 amount, address token);
    event Settlement(uint256 indexed groupId, address from, address to, uint256 amount);

    constructor(uint256 _platformFeeBP) Ownable() {
        platformFeeBP = _platformFeeBP;
    }

    function createGroup(string calldata _name, address[] calldata _members) external {
        require(bytes(_name).length > 0, "Empty name");
        require(_members.length > 0, "No members");

        uint256 groupId = groups.length;
        Group storage newGroup = groups.push();
        newGroup.creator = msg.sender;
        newGroup.name = _name;

        for (uint256 i = 0; i < _members.length; i++) {
            require(_members[i] != address(0), "Invalid address");
            newGroup.members.push(_members[i]);
            newGroup.isMember[_members[i]] = true;
        }

        emit GroupCreated(groupId, msg.sender);
    }

    function addExpense(
        uint256 _groupId,
        uint256 _amount,
        address _token,
        string calldata _description
    ) external payable nonReentrant {
        Group storage group = groups[_groupId];
        require(group.isMember[msg.sender], "Not member");
        require(_amount > 0, "Invalid amount");

        if (_token == address(0)) {
            require(msg.value == _amount, "Value mismatch");
        } else {
            IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        }

        uint256 share = _amount / group.members.length;
        for (uint256 i = 0; i < group.members.length; i++) {
            if (group.members[i] != msg.sender) {
                group.balances[group.members[i]] += int256(share);
            }
        }

        emit ExpenseAdded(_groupId, msg.sender, _amount, _token);
    }

    function settleDebt(
        uint256 _groupId,
        address _token,
        address _to,
        uint256 _amount
    ) external payable nonReentrant {
        Group storage group = groups[_groupId];
        require(group.isMember[msg.sender] && group.isMember[_to], "Not members");

        uint256 fee = (_amount * platformFeeBP) / 10000;
        uint256 netAmount = _amount - fee;

        group.balances[msg.sender] -= int256(_amount);
        group.balances[_to] += int256(netAmount);

        if (_token == address(0)) {
            payable(_to).transfer(netAmount);
        } else {
            IERC20(_token).transfer(_to, netAmount);
        }

        emit Settlement(_groupId, msg.sender, _to, netAmount);
    }

    function setPlatformFee(uint256 _newFeeBP) external onlyOwner {
        require(_newFeeBP <= 500, "Max 5% fee");
        platformFeeBP = _newFeeBP;
    }

    function withdrawFees(address _token) external onlyOwner nonReentrant {
        if (_token == address(0)) {
            payable(owner()).transfer(address(this).balance);
        } else {
            IERC20(_token).transfer(owner(), IERC20(_token).balanceOf(address(this)));
        }
    }
}