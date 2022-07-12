export const bptAbi = [
  'constructor(string symbol, string name)',
  'function allowance(address owner, address spender) view returns (uint allowance)',
  'function balanceOf(address owner) view returns (uint balance)',
  'function totalSupply() view returns (uint totalSupply)',
  'function approve(address spender, uint amount)',
  'event Approval (address owner, address spender, uint256 value)',
]

export const stakingAbi = [
  'constructor(string symbol, string name)',
  'function stakedTokenBalance(address owner) view returns (uint balance)',
  'function balancerGauge() view returns (address contractAddress)',
  'function earmarkIncentive() view returns (uint incentive)',
  'function earnedBAL(address user) view returns (uint balReward)',
  'function earnedWNCG(address user) view returns (uint wncgReward)',
  'function getBALRewardRate() view returns (uint rewardRate)',
  'function getWNCGEmissionPerSec() view returns (uint emission)',
  'function getCooldownEndTimestamp(address user) view returns (uint timestamp)',
  'function getWithdrawEndTimestamp(address user) view returns (uint timestamp)',
  'function totalStaked() view returns (uint balance) ',
  'function claimAllRewards()',
  'function claimBALRewards()',
  'function claimWNCGRewards(uint amount)',
  'function cooldown()',
  'function earmarkRewards()',
  'function stake(uint amount)',
  'function withdraw(uint amount, bool isClaimAllRewards)',
  'function FEE_DENOMINATOR() view returns (uint denominator)',
  'function STAKED_TOKEN() view returns (address contractAddress)',
  'function UNSTAKE_WINDOW() view returns (uint timestamp)',
  'event Staked(address user, uint256 amount)',
  'event EarmarkRewards(address user, uint256 balReward)',
  'event RewardsClaimedAll(address to)',
  'event RewardsClaimed_WNCG(address to, uint256 amount)',
  'event RewardsClaimed_BAL(address to, uint256 amount)',
  'event Cooldown(address user)',
  'event Withdrawn(address user, uint256 amount)',
  'event FeeUpdate(address user, uint256 amount)',
]

export const balRewardAbi = [
  'function claimable_tokens(address contract) view returns (uint balance)',
]
