
import { ethers } from 'ethers'
import deployedContracts from '../deployed-contracts.json'

// Contract ABIs (simplified - you should use the full ABIs from your compiled contracts)
const SPLITCHAIN_CORE_ABI = [
  "function createGroup(string calldata _name, address[] calldata _members) external",
  "function addExpense(uint256 _groupId, uint256 _amount, address _token, string calldata _description) external payable",
  "function settleDebt(uint256 _groupId, address _token, address _to, uint256 _amount) external payable",
  "function platformFeeBP() external view returns (uint256)",
  "event GroupCreated(uint256 indexed groupId, address creator)",
  "event ExpenseAdded(uint256 indexed groupId, address payer, uint256 amount, address token)",
  "event Settlement(uint256 indexed groupId, address from, address to, uint256 amount)"
]

const SPLITCHAIN_TOKEN_ABI = [
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)"
]

const SPLITCHAIN_FACTORY_ABI = [
  "function deployCore(uint256 _platformFeeBP) external returns (address)",
  "function getDeployedContracts() external view returns (address[] memory)",
  "event NewCoreDeployed(address indexed coreAddress, address indexed owner)"
]

const SPLITCHAIN_ANALYTICS_ABI = [
  "function getUserStats(address user) external view returns (uint256, uint256, uint256)",
  "function getGroupStats(uint256 groupId) external view returns (uint256, uint256, uint256)"
]

const SPLITCHAIN_GOVERNANCE_ABI = [
  "function votingToken() external view returns (address)",
  "function proposalThreshold() external view returns (uint256)",
  "function quorum(uint256 blockNumber) external view returns (uint256)"
]

export const CONTRACT_ADDRESSES = {
  token: deployedContracts.token,
  core: deployedContracts.core,
  factory: deployedContracts.factory,
  multiToken: deployedContracts.multiToken,
  analytics: deployedContracts.analytics,
  governance: deployedContracts.governance
}

export const getContract = (contractName: keyof typeof CONTRACT_ADDRESSES, provider: ethers.Provider | ethers.Signer) => {
  const address = CONTRACT_ADDRESSES[contractName]
  
  switch (contractName) {
    case 'core':
      return new ethers.Contract(address, SPLITCHAIN_CORE_ABI, provider)
    case 'token':
      return new ethers.Contract(address, SPLITCHAIN_TOKEN_ABI, provider)
    case 'factory':
      return new ethers.Contract(address, SPLITCHAIN_FACTORY_ABI, provider)
    case 'analytics':
      return new ethers.Contract(address, SPLITCHAIN_ANALYTICS_ABI, provider)
    case 'governance':
      return new ethers.Contract(address, SPLITCHAIN_GOVERNANCE_ABI, provider)
    default:
      throw new Error(`Unknown contract: ${contractName}`)
  }
}

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  throw new Error('No ethereum provider found')
}

export const getSigner = async () => {
  const provider = getProvider()
  return await provider.getSigner()
}

// BlockDAG network configuration
export const BLOCKDAG_NETWORK = {
  chainId: 1043,
  name: 'BlockDAG Testnet',
  rpcUrl: 'https://rpc.primordial.bdagscan.com',
  blockExplorerUrl: 'https://bdagscan.com',
  nativeCurrency: {
    name: 'BlockDAG',
    symbol: 'BDAG',
    decimals: 18
  }
}
