export const QUERY_KEYS = {
  Balancer: {
    Proportional: 'staking:Balancer:proportional',
  },
  Build: 'staking:build',
  PancakeSwap: {
    AddLiquidityReserves: 'staking:pancakeSwap:addLiquidityReserves',
  },
  Harvest: 'staking:harvest',
  Liquidity: {
    AddLiquidity: {
      OptimizedAmounts: 'staking:addLiquidity:optimizedAmounts',
      PropAmounts: 'staking:addLiquidity:propAmounts',
    },
    RemoveLiquidity: 'staking:removeLiquidity',
  },
  FallbackPrices: 'staking:fallbackPriceMap',
  Prices: 'staking:priceMap',
  Staking: {
    Apr: 'staking:apr',
    Data: 'staking:data',
    FallbackPrices: 'staking:fallbackPrices',
    LpBalances: 'staking:lpBalances',
    Prefetch: 'staking:prefetch',
    Prices: 'staking:prices',
    Statistics: 'staking:staking:statistics',
    TotalStaked: 'staking:staking:totalStaked',
  },
  Pool: {
    Data: 'pool:data',
    Snapshot: 'pool:snapshot',
    LatestPoolStatus: 'pool:latestPoolStatus',
  },
  User: {
    Data: 'user:data',
    StakedTokenBalance: 'user:stakedTokenBalance',
    Rewards: 'user:rewards',
    Allowances: 'user:allowances',
    Balances: 'user:balances',
    UnstakeTimestamps: 'user:unstakeTimestamps',
  },
  Zap: {
    In: 'zap:in',
    Out: 'zap:out',
  },
} as const
