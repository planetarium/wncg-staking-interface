import { MouseEvent, useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { RESET, useResetAtom } from 'jotai/utils'

import {
  EstimationPeriod,
  estimationPeriodAtom,
  legacyModeAtom,
  mutedAtom,
  slippageAtom,
} from 'states/userSettings'
import { gaEvent } from 'lib/gtag'
import { useTx } from './useTx'

export function useSettings() {
  const { resetTx } = useTx()

  const setEstimationPeriod = useSetAtom(estimationPeriodAtom)
  const setMuted = useSetAtom(mutedAtom)
  const setSlippage = useSetAtom(slippageAtom)
  const setLegacyMode = useSetAtom(legacyModeAtom)

  const resetLegacyMode = useResetAtom(legacyModeAtom)

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
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

  const updateEstimationPeriod = useCallback(
    <T extends HTMLButtonElement>(e: MouseEvent<T>) => {
      const { value: newPeriod } = e.currentTarget as T & {
        value: EstimationPeriod
      }
      setEstimationPeriod(newPeriod)
      gaEvent({
        name: 'estimated_earn_period',
        params: {
          period: newPeriod,
        },
      })
    },
    [setEstimationPeriod]
  )

  const updateSlippage = useCallback(
    (value: string | null) => {
      const newSlippage = value ? Number(value) : null
      setSlippage(newSlippage)
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
    setEstimationPeriod(RESET)
    setMuted(RESET)
    setSlippage(RESET)
    resetLegacyMode()
  }, [resetLegacyMode, setEstimationPeriod, setMuted, setSlippage])

  return {
    resetSettings,
    toggleLegacyMode,
    toggleMuted,
    updateEstimationPeriod,
    updateSlippage,
  }
}
