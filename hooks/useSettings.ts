import { MouseEvent, useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import {
  EstimationPeriod,
  estimationPeriodAtom,
  mutedAtom,
  slippageAtom,
} from 'states/userSettings'
import { gaEvent } from 'lib/gtag'

export function useSettings() {
  const setEstimationPeriod = useSetAtom(estimationPeriodAtom)
  const setMuted = useSetAtom(mutedAtom)
  const setSlippage = useSetAtom(slippageAtom)

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
  }, [setEstimationPeriod, setMuted, setSlippage])

  return {
    resetSettings,
    toggleMuted,
    updateEstimationPeriod,
    updateSlippage,
  }
}
