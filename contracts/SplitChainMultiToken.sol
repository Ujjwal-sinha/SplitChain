// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SplitChainMultiToken
 * @dev Extension for handling multiple token types in expenses
 */
contract SplitChainMultiToken is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    // Supported tokens
    mapping(address => bool) public supportedTokens;
    mapping(address => string) public tokenSymbols;
    address[] public tokenList;
    
    // Price oracle for token conversions
    mapping(address => uint256) public tokenPrices; // Price in USD with 8 decimals
    
    event TokenAdded(address indexed token, string symbol);
    event TokenRemoved(address indexed token);
    event PriceUpdated(address indexed token, uint256 price);
    
    constructor() {
        // Add ETH as supported (address(0))
        supportedTokens[address(0)] = true;
        tokenSymbols[address(0)] = "ETH";
        tokenList.push(address(0));
    }
    
    function addSupportedToken(address token, string memory symbol) external onlyOwner {
        require(token != address(0), "Use address(0) for ETH");
        require(!supportedTokens[token], "Token already supported");
        
        supportedTokens[token] = true;
        tokenSymbols[token] = symbol;
        tokenList.push(token);
        
        emit TokenAdded(token, symbol);
    }
    
    function removeSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Cannot remove ETH");
        require(supportedTokens[token], "Token not supported");
        
        supportedTokens[token] = false;
        delete tokenSymbols[token];
        
        // Remove from array
        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokenList[i] == token) {
                tokenList[i] = tokenList[tokenList.length - 1];
                tokenList.pop();
                break;
            }
        }
        
        emit TokenRemoved(token);
    }
    
    function updateTokenPrice(address token, uint256 price) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        tokenPrices[token] = price;
        emit PriceUpdated(token, price);
    }
    
    function getSupportedTokens() external view returns (address[] memory, string[] memory) {
        string[] memory symbols = new string[](tokenList.length);
        for (uint256 i = 0; i < tokenList.length; i++) {
            symbols[i] = tokenSymbols[tokenList[i]];
        }
        return (tokenList, symbols);
    }
    
    function convertToUSD(address token, uint256 amount) external view returns (uint256) {
        require(supportedTokens[token], "Token not supported");
        uint256 price = tokenPrices[token];
        require(price > 0, "Price not set");
        
        // Convert amount to USD (assuming 18 decimals for tokens, 8 for price)
        return (amount * price) / 10**18;
    }
    
    function convertFromUSD(address token, uint256 usdAmount) external view returns (uint256) {
        require(supportedTokens[token], "Token not supported");
        uint256 price = tokenPrices[token];
        require(price > 0, "Price not set");
        
        // Convert USD amount to token amount
        return (usdAmount * 10**18) / price;
    }
}
