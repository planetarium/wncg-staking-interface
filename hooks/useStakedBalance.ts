import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { stakedTokenBalancesAtom } from 'states/user'
import { legacyModeAtom } from 'states/userSettings'
import { configService } from 'services/config'
import { bnum } from 'utils/num'

const legacyContractIndex = configService.stakingContractAddresses.findIndex(
  (address) => address === configService.legacyStakingAddress
)
const stakingContractIndex = configService.stakingContractAddresses.indexOf(
  configService.stakingAddress
)

export function useStakedBalance() {
  const legacyMode = useAtomValue(legacyModeAtom)

  const stakedBalances = useAtomValue(stakedTokenBalancesAtom)

  const currentVersionIndex = useMemo(
    () => (legacyMode ? legacyContractIndex : stakingContractIndex),
    [legacyMode]
  )

  const stakedBalance = useMemo(() => {
    return stakedBalances[currentVersionIndex]
  }, [currentVersionIndex, stakedBalances])

  const hasBalanceInLegacyContract = useMemo(
    () => bnum(stakedBalances[legacyContractIndex]).gt(0),
    [stakedBalances]
  )

  return {
    hasBalanceInLegacyContract,
    stakedBalance,
  }
}
