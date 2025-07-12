// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Extended interface to include decimals() method
interface IERC20Metadata is IERC20 {
    function decimals() external view returns (uint8);
}

contract SplitChainMultiToken is Ownable {
    // Mapping to store supported ERC20 tokens
    mapping(address => bool) public isSupportedToken;

    // Mapping to store token prices (e.g., USD price with 8 decimals)
    mapping(address => uint256) public tokenPrices; // tokenAddress => price in USD (e.g., 10^8 for $1)

    event TokenSupported(address indexed tokenAddress, bool supported);
    event TokenPriceUpdated(address indexed tokenAddress, uint256 newPrice);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Adds or removes a token from the list of supported tokens.
     * Only the owner can call this function.
     * @param _tokenAddress The address of the ERC20 token.
     * @param _supported True to add, false to remove.
     */
    function setTokenSupport(address _tokenAddress, bool _supported) public onlyOwner {
        require(_tokenAddress != address(0), "Invalid token address");
        isSupportedToken[_tokenAddress] = _supported;
        emit TokenSupported(_tokenAddress, _supported);
    }

    /**
     * @dev Updates the price of a supported token in USD.
     * Price is expected with 8 decimals (e.g., $1.00 = 100000000).
     * Only the owner can call this function.
     * @param _tokenAddress The address of the ERC20 token.
     * @param _price The new price of the token in USD (with 8 decimals).
     */
    function updateTokenPrice(address _tokenAddress, uint256 _price) public onlyOwner {
        require(isSupportedToken[_tokenAddress], "Token not supported");
        require(_price > 0, "Price must be greater than 0");
        tokenPrices[_tokenAddress] = _price;
        emit TokenPriceUpdated(_tokenAddress, _price);
    }

    /**
     * @dev Returns the price of a supported token in USD.
     * @param _tokenAddress The address of the ERC20 token.
     * @return The price of the token in USD (with 8 decimals).
     */
    function getTokenPrice(address _tokenAddress) public view returns (uint256) {
        require(isSupportedToken[_tokenAddress], "Token not supported");
        return tokenPrices[_tokenAddress];
    }

    /**
     * @dev Converts an amount of a supported token to its USD equivalent.
     * Assumes token amounts are in their native decimals (e.g., 18 for most ERC20s).
     * Returns USD amount with 8 decimals.
     * @param _tokenAddress The address of the ERC20 token.
     * @param _tokenAmount The amount of the token.
     * @return The equivalent amount in USD (with 8 decimals).
     */
    function convertTokenToUsd(address _tokenAddress, uint256 _tokenAmount) public view returns (uint256) {
        require(isSupportedToken[_tokenAddress], "Token not supported");
        uint256 price = tokenPrices[_tokenAddress];
        uint8 tokenDecimals = IERC20Metadata(_tokenAddress).decimals();

        // Scale tokenAmount to 18 decimals, then multiply by price (8 decimals), then divide by 10^18
        // This gives result in 8 decimals
        uint256 scaledTokenAmount = _tokenAmount * (10 ** (18 - tokenDecimals));
        uint256 usdAmount = (scaledTokenAmount * price) / (10 ** 18);

        return usdAmount;
    }

    /**
     * @dev Converts a USD amount (with 8 decimals) to an equivalent amount of a supported token.
     * Returns token amount in its native decimals.
     * @param _tokenAddress The address of the ERC20 token.
     * @param _usdAmount The amount in USD (with 8 decimals).
     * @return The equivalent amount of the token (in its native decimals).
     */
    function convertUsdToToken(address _tokenAddress, uint256 _usdAmount) public view returns (uint256) {
        require(isSupportedToken[_tokenAddress], "Token not supported");
        uint256 price = tokenPrices[_tokenAddress];
        require(price > 0, "Token price is zero");
        uint8 tokenDecimals = IERC20Metadata(_tokenAddress).decimals();

        // usdAmount is in 8 decimals, price is in 8 decimals
        uint256 tokenAmount = (_usdAmount * (10 ** tokenDecimals)) / price;

        return tokenAmount;
    }
}
