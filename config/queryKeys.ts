export const queryKeys = {
  Build: 'staking:build',
  FallbackPriceMap: 'staking:fallbackPriceMap',
  PriceMap: 'staking:priceMap',
  Staking: {
    Data: 'staking:data',
    FallbackPrices: 'staking:fallbackPrices',
    LpBalances: 'staking:lpBalances',
    Prefetch: 'staking:prefetch',
    Prices: 'staking:prices',
    Statistics: 'staking:staking:statistics',
  },
  Pool: {
    Data: 'pool:data',
    Snapshot: 'pool:snapshot',
  },
  User: {
    Data: 'user:data',
    StakedTokenBalance: 'user:stakedTokenBalance',
    Rewards: 'user:rewards',
    Allowances: 'user:allowances',
    Balances: 'user:balances',
    UnstakeTimestamps: 'user:unstakeTimestamps',
  },
} as const
