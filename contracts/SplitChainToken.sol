// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SplitChainToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    constructor() ERC20("SplitChain Token", "SPLIT") Ownable() {
        _mint(msg.sender, MAX_SUPPLY);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}