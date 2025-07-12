// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol"; // Added for timelock
import "@openzeppelin/contracts/token/ERC20/extensions/IVotes.sol"; // Explicitly import IVotes
import "@openzeppelin/contracts/governance/TimelockController.sol";

contract SplitChainGovernance is
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorSettings,
    GovernorTimelockControl // Inherit GovernorTimelockControl
{
    /// @notice The ERC20 token used for voting (e.g., SplitChainToken)
    ERC20 public immutable votingToken;

    /**
     * @param _token The governance/voting token (must implement IVotes)
     * @param _timelock The timelock controller for executing governance proposals
     */
    constructor(IVotes _token, TimelockController _timelock)
        Governor("SplitChainGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4) // 4% quorum
        GovernorSettings(1 /* voting delay */, 45818 /* voting period */, 0 /* proposal threshold */)
        GovernorTimelockControl(_timelock) // Initialize timelock
    {
        votingToken = ERC20(address(_token));

        // Grant roles to this contract for timelock control
        _timelock.grantRole(_timelock.PROPOSER_ROLE(), address(this));
        _timelock.grantRole(_timelock.EXECUTOR_ROLE(), address(0)); // Allow anyone to execute (or restrict as needed)
        
        // Optional: Revoke admin role from deployer for security
        // _timelock.revokeRole(_timelock.TIMELOCK_ADMIN_ROLE(), msg.sender);
    }

    /// @notice Returns the token used for voting
    function token() public view override returns (IVotes) {
        return IVotes(address(votingToken));
    }

    // Override required functions for GovernorTimelockControl
    function timelock() public view override(Governor, GovernorTimelockControl) returns (address) {
        return super.timelock();
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
        )
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}