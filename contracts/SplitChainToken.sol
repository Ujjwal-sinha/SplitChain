// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SplitChainToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * (10 ** 18); // 100 million tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * (10 ** 18); // 100 million tokens

    // Minter role for controlled token creation
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("SplitChain Token", "SPLIT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY); // Mint initial supply to the deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // Deployer is default admin
        _grantRole(MINTER_ROLE, msg.sender); // Deployer is also a minter initially
    }

    /**
     * @dev Mints `amount` tokens to `to`.
     * Only accounts with the `MINTER_ROLE` can call this function.
     * Cannot mint more than MAX_SUPPLY.
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "SplitChainToken: max supply exceeded");
        _mint(to, amount);
    }

    /**
     * @dev Adds a new minter.
     * Only accounts with the `DEFAULT_ADMIN_ROLE` can call this function.
     */
    function addMinter(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, minter);
    }

    /**
     * @dev Removes a minter.
     * Only accounts with the `DEFAULT_ADMIN_ROLE` can call this function.
     */
    function removeMinter(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, minter);
    }
}
