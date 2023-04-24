import { memo, useCallback, useEffect } from 'react'
import { useSetAtom } from 'jotai'
import store from 'store'

import {
  estimationPeriodAtom,
  mutedAtom,
  slippageAtom,
} from 'states/userSettings'
import STORAGE_KEYS from 'constants/storageKeys'

function ConfigEffects() {
  const setMuted = useSetAtom(mutedAtom)
  const setSlippage = useSetAtom(slippageAtom)
  const setEstimationPeriod = useSetAtom(estimationPeriodAtom)

  const setInitialSettings = useCallback(() => {
    const storedPeriod = store.get(STORAGE_KEYS.UserSettings.EstimationPeriod)
    const storedSlippage = store.get(STORAGE_KEYS.UserSettings.Slippage)
    const storedMuted = store.get(STORAGE_KEYS.UserSettings.Muted)

    if (storedPeriod) setEstimationPeriod(storedPeriod)
    if (storedSlippage) setSlippage(storedSlippage)
    if (storedMuted) setMuted(storedMuted)
  }, [setEstimationPeriod, setMuted, setSlippage])

  useEffect(() => {
    setInitialSettings()
  }, [setInitialSettings])

  return null
}

export default memo(ConfigEffects)
