import { memo } from 'react'
import { useMount } from 'react-use'
import { useSetRecoilState } from 'recoil'
import store from 'store'

import {
  estimatedEarnPeriodState,
  mutedState,
  slippageState,
} from 'app/states/settings'
import STORAGE_KEYS from 'constants/storageKeys'

function ConfigEffects() {
  const setMuted = useSetRecoilState(mutedState)
  const setSlippage = useSetRecoilState(slippageState)
  const setEstimatedEarnPeriod = useSetRecoilState(estimatedEarnPeriodState)

  useMount(() => {
    const storedPeriod = store.get(
      STORAGE_KEYS.UserSettings.EstimatedEarnPeriod
    )
    const storedSlippage = store.get(STORAGE_KEYS.UserSettings.Slippage)
    const storedMuted = store.get(STORAGE_KEYS.UserSettings.Muted)

    if (storedPeriod) setEstimatedEarnPeriod(storedPeriod)
    if (storedSlippage) setSlippage(storedSlippage)
    if (storedMuted) setMuted(storedMuted)
  })

  return null
}

export default memo(ConfigEffects)
