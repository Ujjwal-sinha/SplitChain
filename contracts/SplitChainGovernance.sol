// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";

contract SplitChainGovernance is Governor, GovernorSettings, GovernorCountingSimple {
    constructor(address _token)
        Governor("SplitChainGovernance")
        GovernorSettings(1, 604800, 0) // 1 block voting delay, 1 week voting period
    {}

    function quorum(uint256) public pure override returns (uint256) {
        return 1000 * 10**18; // 1000 SPLIT tokens required
    }

    function votingToken() public view override returns (address) {
        return address(_token);
    }
}