// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SplitChainMultiToken is Ownable {
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public fixedPrices; // Price in BDAG per token (18 decimals)
    
    event TokenAdded(address indexed token, uint256 fixedPrice);
    event TokenRemoved(address indexed token);
    event PriceUpdated(address indexed token, uint256 newPrice);
    
    function addToken(address _token, uint256 _fixedPrice) external onlyOwner {
        supportedTokens[_token] = true;
        fixedPrices[_token] = _fixedPrice;
        emit TokenAdded(_token, _fixedPrice);
    }
    
    function removeToken(address _token) external onlyOwner {
        supportedTokens[_token] = false;
        delete fixedPrices[_token];
        emit TokenRemoved(_token);
    }
    
    function updatePrice(address _token, uint256 _newPrice) external onlyOwner {
        require(supportedTokens[_token], "Token not supported");
        fixedPrices[_token] = _newPrice;
        emit PriceUpdated(_token, _newPrice);
    }
    
    function convertToBDAG(address _token, uint256 _amount) external view returns (uint256) {
        require(supportedTokens[_token], "Unsupported token");
        return (_amount * fixedPrices[_token]) / 1e18;
    }
}