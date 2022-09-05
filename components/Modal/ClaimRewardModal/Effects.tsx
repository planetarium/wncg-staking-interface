import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'

import { useEvents, useProvider } from 'hooks'

type ClaimRewardEffectsProps = {
  setLoading: Dispatch<SetStateAction<string | null>>
}

export function ClaimRewardEffects({ setLoading }: ClaimRewardEffectsProps) {
  const { rewardsClaimedBalEvent, rewardsClaimedWncgEvent } = useEvents()
  const provider = useProvider()

  const rewardsClaimedHandler = useCallback(() => {
    setLoading(null)
  }, [setLoading])

  // NOTE: Reward BAL event
  useEffect(() => {
    if (rewardsClaimedBalEvent) {
      provider?.on(rewardsClaimedBalEvent, rewardsClaimedHandler)
      return () => {
        provider?.off(rewardsClaimedBalEvent)
      }
    }
  }, [rewardsClaimedHandler, provider, rewardsClaimedBalEvent])

  // NOTE: Reward WNCG event
  useEffect(() => {
    if (rewardsClaimedWncgEvent) {
      provider?.on(rewardsClaimedWncgEvent, rewardsClaimedHandler)
      return () => {
        provider?.off(rewardsClaimedWncgEvent)
      }
    }
  }, [rewardsClaimedHandler, provider, rewardsClaimedWncgEvent])

  return null
}
