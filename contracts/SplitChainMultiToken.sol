// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SplitChainMultiToken is Ownable {
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenPrices; // USD price (8 decimals)

    event TokenAdded(address token, uint256 price);
    event TokenRemoved(address token);

    function addToken(address _token, uint256 _price) external onlyOwner {
        supportedTokens[_token] = true;
        tokenPrices[_token] = _price;
        emit TokenAdded(_token, _price);
    }

    function removeToken(address _token) external onlyOwner {
        supportedTokens[_token] = false;
        emit TokenRemoved(_token);
    }

    function convertToUSD(address _token, uint256 _amount) external view returns (uint256) {
        require(supportedTokens[_token], "Token not supported");
        return (_amount * tokenPrices[_token]) / 10**8;
    }
}