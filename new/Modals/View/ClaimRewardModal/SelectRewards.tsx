import { FormEvent, memo, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { useRewards } from 'hooks'

import RewardCard from './RewardCard'

type SelectRewardsField = {
  tokensToClaim: string[]
}

function SelectRewards() {
  const { rewards, rewardsInFiatValue, rewardTokensList } = useRewards()

  const { register, watch } = useForm<SelectRewardsField>({
    mode: 'onChange',
    defaultValues: {
      tokensToClaim: rewardTokensList,
    },
  })

  const tokensToImport = watch('tokensToClaim')
  const disabled = useMemo(() => tokensToImport.length === 0, [tokensToImport])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
  }, [])

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
