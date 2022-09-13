import { memo, useCallback } from 'react'
import { useMount } from 'react-use'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import store from 'store'

import { connectedState } from 'app/states/connection'
import {
  estimatedEarnPeriodState,
  legacyModeState,
  mutedState,
  slippageState,
} from 'app/states/settings'
import STORAGE_KEYS from 'constants/storageKeys'
import { bnum } from 'utils/num'
import { useStakedBalance } from 'hooks'

function ConfigEffects() {
  const { stakedBalance } = useStakedBalance()

  const isConnected = useRecoilValue(connectedState)
  const setMuted = useSetRecoilState(mutedState)
  const setSlippage = useSetRecoilState(slippageState)
  const setEstimatedEarnPeriod = useSetRecoilState(estimatedEarnPeriodState)
  const setLegacyMode = useSetRecoilState(legacyModeState)

  const setInitialLegacyMode = useCallback(() => {
    const storedLegacyMode = store.get(STORAGE_KEYS.UserSettings.LegacyMode)
    if (storedLegacyMode) {
      setLegacyMode(storedLegacyMode)
      return
    }

    if (!isConnected || bnum(stakedBalance).isZero()) {
      setLegacyMode(true)
    }
  }, [isConnected, setLegacyMode, stakedBalance])

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

  useMount(() => {
    setInitialLegacyMode()
    setInitialSettings()
  })

  return null
}

export default memo(ConfigEffects)
