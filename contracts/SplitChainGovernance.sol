// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/interfaces/IERC5805.sol";
import "./SplitChainToken.sol";

contract SplitChainGovernance is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes {
    
    constructor(IERC5805 _token)
        Governor("SplitChainGovernance")
        GovernorSettings(1, 50400, 100e18) // 1 block delay, 1 week voting, 100 SPLIT proposal threshold
        GovernorVotes(_token)
    {
        // No need to set token here - it's handled by GovernorVotes parent constructor
    }

    function votingToken() public view returns (address) {
        return address(token);
    }

    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        return 10_000e18; // 10,000 SPLIT required
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return 100e18; // 100 SPLIT needed to propose
    }
}