import config from 'config'
import { atomWithStorage } from 'jotai/utils'

const sampleApprove: ApproveTx = {
  hash: '0x9c63a975453859445fd535d6163b9426c2e76c5494293ed496cd2bb1227244ce',
  spender: config.stakingAddress,
  spenderName: 'staking',
  toastLabel: 'stake',
  tokenAddress: '0x16faf9f73748013155b7bc116a3008b57332d1e6',
  tokenName: 'B-50WBTC-50WETH',
  tokenSymbol: 'B-50WBTC-50WETH',
  tokenDecimals: 18,
}

export const approveTxAtom = atomWithStorage<ApproveTx>(
  `wncg:staking:approveTx`,
  {}
)

export const claimTxAtom = atomWithStorage<ClaimTx>(`wncg:staking:claimTx`, {})

export const cooldownTxAtom = atomWithStorage<CooldownTx>(
  `wncg:staking:cooldownTx`,
  {}
)

export const harvestTxAtom = atomWithStorage<HarvestTx>(
  `wncg:staking:harvestTx`,
  {}
)

export const stakeTxAtom = atomWithStorage<StakeTx>(`wncg:staking:stakeTx`, {})

export const unstakeTxAtom = atomWithStorage<UnstakeTx>(
  `wncg:staking:unstakeTx`,
  {}
)

export const joinTxAtom = atomWithStorage<JoinTx>(`wncg:staking:joinTx`, {})

export const exitTxAtom = atomWithStorage<ExitTx>(`wncg:staking:exitTx`, {})
