import { calcApr } from 'utils/calcApr'
import { useFiat } from './useFiat'
import { useRewards } from './useRewards'
import { useStaking } from './useStaking'
import { useFetchStaking } from './queries'
import { useAtomValue } from 'jotai'
import { priceMapAtom } from 'states/system'

export function useApr() {
  const toFiat = useFiat()
  const priceMap = useAtomValue(priceMapAtom)
  const { bptAddress, rewardEmissions, rewardTokenAddresses } = useStaking()

  const { totalStaked = '0' } = useFetchStaking().data ?? {}

  const totalStakedValue = toFiat(totalStaked, bptAddress)

  const aprs = rewardEmissions.map((e, i) =>
    calcApr(e, priceMap[rewardTokenAddresses[i]] ?? '0', totalStakedValue)
  )

  return aprs
}
