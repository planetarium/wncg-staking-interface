import { MouseEvent, useCallback } from 'react'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import store from 'store'

import {
  EstimatedEarnPeriod,
  estimatedEarnPeriodState,
  legacyModeState,
  mutedState,
  slippageState,
} from 'app/states/settings'
import STORAGE_KEYS from 'constants/storageKeys'
import { gaEvent } from 'lib/gtag'
import { useTx } from './useTx'

export function useSettings() {
  const { resetTx } = useTx()

  const setEstimatedEarnPeriod = useSetRecoilState(estimatedEarnPeriodState)
  const setMuted = useSetRecoilState(mutedState)
  const setSlippage = useSetRecoilState(slippageState)
  const setLegacyMode = useSetRecoilState(legacyModeState)

  const resetEstimatedEarnPeriod = useResetRecoilState(estimatedEarnPeriodState)
  const resetMuted = useResetRecoilState(mutedState)
  const resetSlippage = useResetRecoilState(slippageState)
  const resetLegacyMode = useResetRecoilState(legacyModeState)

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      store.set(STORAGE_KEYS.UserSettings.Muted, !prev)
      gaEvent({
        name: 'mute_sound',
        params: {
          muted: !prev,
        },
      })
      return !prev
    })
  }, [setMuted])

  const toggleLegacyMode = useCallback(() => {
    setLegacyMode((prev) => {
      store.set(STORAGE_KEYS.UserSettings.LegacyMode, !prev)
      gaEvent({
        name: 'legacy_contract',
        params: {
          isLegacyContract: !prev,
        },
      })
      return !prev
    })
    resetTx()
  }, [resetTx, setLegacyMode])

  const updateEstimatedEarnPeriod = useCallback(
    <T extends HTMLButtonElement>(e: MouseEvent<T>) => {
      const { value: newPeriod } = e.currentTarget as T & {
        value: EstimatedEarnPeriod
      }

      setEstimatedEarnPeriod(newPeriod)
      store.set(STORAGE_KEYS.UserSettings.EstimatedEarnPeriod, newPeriod)
      gaEvent({
        name: 'estimated_earn_period',
        params: {
          period: newPeriod,
        },
      })
    },
    [setEstimatedEarnPeriod]
  )

  const updateSlippage = useCallback(
    (value: string | null) => {
      const newSlippage = value ? Number(value) : null

      setSlippage(newSlippage)
      store.set(STORAGE_KEYS.UserSettings.Slippage, newSlippage)
      gaEvent({
        name: 'slippage',
        params: {
          period: newSlippage,
        },
      })
    },
    [setSlippage]
  )

  const resetSettings = useCallback(() => {
    resetEstimatedEarnPeriod()
    resetMuted()
    resetSlippage()
    resetLegacyMode()
    store.remove(STORAGE_KEYS.UserSettings.EstimatedEarnPeriod)
    store.remove(STORAGE_KEYS.UserSettings.Muted)
    store.remove(STORAGE_KEYS.UserSettings.Slippage)
    store.remove(STORAGE_KEYS.UserSettings.LegacyMode)
  }, [resetEstimatedEarnPeriod, resetLegacyMode, resetMuted, resetSlippage])

  return {
    resetSettings,
    toggleLegacyMode,
    toggleMuted,
    updateEstimatedEarnPeriod,
    updateSlippage,
  }
}
