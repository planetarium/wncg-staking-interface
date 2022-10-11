import { FormEvent, memo, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { useClaimRewards, useRewards } from 'hooks'
import { useStaking } from 'hooks/contracts'

import RewardCard from './RewardCard'

type SelectRewardsField = {
  tokensToClaim: string[]
}

function SelectRewards() {
  const { claim } = useClaimRewards()
  const { rewards, rewardsInFiatValue } = useRewards()
  const { rewardTokensList } = useStaking()

  const { register, watch } = useForm<SelectRewardsField>({
    mode: 'onChange',
    defaultValues: {
      tokensToClaim: rewardTokensList,
    },
  })

  const tokensToImport = watch('tokensToClaim')
  const disabled = useMemo(() => tokensToImport.length === 0, [tokensToImport])

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      try {
        const claimRewards = claim(tokensToImport)
        const response = await claimRewards?.()
        if (!response) return
        return response
      } catch (error) {
        console.log(error)
      }
    },
    [claim, tokensToImport]
  )

  return (
    <form onSubmit={handleSubmit}>
      {rewardTokensList.map((tokenAddress, i) => (
        <RewardCard
          key={`selectRewards:${tokenAddress}`}
          address={tokenAddress}
          fiatValue={rewardsInFiatValue[i]}
          reward={rewards[i]}
          register={register}
        />
      ))}

      <button type="submit" disabled={disabled}>
        Claim
      </button>
    </form>
  )
}

export default memo(SelectRewards)
