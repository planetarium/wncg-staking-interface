import { memo, useCallback, useEffect } from 'react'
import { useSetAtom } from 'jotai'
import store from 'store'

import {
  estimationPeriodAtom,
  legacyModeAtom,
  mutedAtom,
  slippageAtom,
} from 'states/userSettings'
import STORAGE_KEYS from 'constants/storageKeys'
import { useStakedBalance } from 'hooks'

function ConfigEffects() {
  const { hasBalanceInLegacyContract } = useStakedBalance()
  const setMuted = useSetAtom(mutedAtom)
  const setSlippage = useSetAtom(slippageAtom)
  const setEstimationPeriod = useSetAtom(estimationPeriodAtom)
  const setLegacyMode = useSetAtom(legacyModeAtom)

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

  useEffect(() => {
    if (!hasBalanceInLegacyContract) return
    setLegacyMode(true)
  }, [hasBalanceInLegacyContract, setLegacyMode])

  return null
}

export default memo(ConfigEffects)
