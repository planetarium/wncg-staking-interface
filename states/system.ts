import { atom } from 'jotai'

import { atomWithStorage } from 'jotai/utils'

// import { PREFETCH_PLACEHOLDER } from 'config/placeholders'
// import { queryKeys } from 'config/queryKeys'
// import { calcApr } from 'utils/calcApr'

export const currentTimestampAtom = atom(0)
export const priceMapAtom = atom<PriceMap>({})
export const totalStakedAtom = atom<string | null>(null)

export const currentChainAtom = atom<Chain | null>(null)
export const currentChainIdAtom = atom<Network | null>(
  (get) => (get(currentChainAtom)?.id as Network) ?? null
)

export const slippageAtom = atomWithStorage<string | null>(
  `launchpad:staking:slippage`,
  null
)
export const showHarvestAtom = atom(false)

// const prefetchAtom = selectAtom(queryClientAtom, (queryClient) => {
//   return (
//     queryClient.getQueryData<Prefetch>([queryKeys.Staking.Prefetch], {
//       exact: false,
//     }) ?? PREFETCH_PLACEHOLDER
//   )
// })

// export const aprAtom = atom((get) => {
//   const { emissionPerSeconds, stakedToken } = get(prefetchAtom)
//   const priceMap = get(priceMapAtom)
//   const totalStaked = get(totalStakedAtom) ?? '0'

//   const stakedTokenAddress = stakedToken.address
//   const stakedTokenPrice = priceMap[stakedTokenAddress] ?? '0'

//   return calcApr(emissionPerSeconds, stakedTokenPrice, totalStaked)
// })
