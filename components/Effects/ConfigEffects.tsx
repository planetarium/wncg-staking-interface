import { memo, useCallback, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import store from 'store'

import {
  estimatedEarnPeriodState,
  legacyModeState,
  mutedState,
  slippageState,
} from 'app/states/settings'
import STORAGE_KEYS from 'constants/storageKeys'
import { useStakedBalance } from 'hooks'

function ConfigEffects() {
  const { hasBalanceInLegacyContract } = useStakedBalance()
  const setMuted = useSetRecoilState(mutedState)
  const setSlippage = useSetRecoilState(slippageState)
  const setEstimatedEarnPeriod = useSetRecoilState(estimatedEarnPeriodState)
  const setLegacyMode = useSetRecoilState(legacyModeState)

  const setInitialLegacyMode = useCallback(() => {
    if (hasBalanceInLegacyContract) {
      setLegacyMode(true)
    } else {
      setLegacyMode(false)
    }
  }, [hasBalanceInLegacyContract, setLegacyMode])

  const setInitialSettings = useCallback(() => {
    const storedPeriod = store.get(
      STORAGE_KEYS.UserSettings.EstimatedEarnPeriod
    )
    const storedSlippage = store.get(STORAGE_KEYS.UserSettings.Slippage)
    const storedMuted = store.get(STORAGE_KEYS.UserSettings.Muted)

    if (storedPeriod) setEstimatedEarnPeriod(storedPeriod)
    if (storedSlippage) setSlippage(storedSlippage)
    if (storedMuted) setMuted(storedMuted)
  }, [setEstimatedEarnPeriod, setMuted, setSlippage])

  useEffect(() => {
    setInitialLegacyMode()
    setInitialSettings()
  }, [setInitialLegacyMode, setInitialSettings])

  return null
}

export default memo(ConfigEffects)
