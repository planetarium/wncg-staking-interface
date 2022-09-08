import { memo } from 'react'
import { useMount } from 'react-use'
import { useSetRecoilState } from 'recoil'
import store from 'store'

import {
  estimatedEarnPeriodState,
  legacyModeState,
  mutedState,
  slippageState,
} from 'app/states/settings'
import STORAGE_KEYS from 'constants/storageKeys'

function ConfigEffects() {
  const setMuted = useSetRecoilState(mutedState)
  const setSlippage = useSetRecoilState(slippageState)
  const setEstimatedEarnPeriod = useSetRecoilState(estimatedEarnPeriodState)
  const setLegacyMode = useSetRecoilState(legacyModeState)

  useMount(() => {
    const storedPeriod = store.get(
      STORAGE_KEYS.UserSettings.EstimatedEarnPeriod
    )
    const storedSlippage = store.get(STORAGE_KEYS.UserSettings.Slippage)
    const storedMuted = store.get(STORAGE_KEYS.UserSettings.Muted)
    const storedLegacyMode = store.get(STORAGE_KEYS.UserSettings.LegacyMode)

    if (storedPeriod) setEstimatedEarnPeriod(storedPeriod)
    if (storedSlippage) setSlippage(storedSlippage)
    if (storedMuted) setMuted(storedMuted)
    if (storedLegacyMode) setLegacyMode(storedLegacyMode)
  })

  return null
}

export default memo(ConfigEffects)
