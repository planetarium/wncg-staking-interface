import { useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { unstakeTimestampsAtom } from 'states/account'
import { slippageAtom } from 'states/system'
import { hideJoinTooltipAtom, showMyStakingAtom } from 'states/ui'

export function useUserSettings() {
  const setHideJoinTooltip = useSetAtom(hideJoinTooltipAtom)
  const setShowMyStaking = useSetAtom(showMyStakingAtom)
  const setUnstakeTimestamps = useSetAtom(unstakeTimestampsAtom)
  const setSlippage = useSetAtom(slippageAtom)

  const resetSettings = useCallback(() => {
    setHideJoinTooltip(RESET)
    setShowMyStaking(RESET)
    setUnstakeTimestamps(RESET)
    setSlippage(RESET)
  }, [setHideJoinTooltip, setShowMyStaking, setSlippage, setUnstakeTimestamps])

  return resetSettings
}
