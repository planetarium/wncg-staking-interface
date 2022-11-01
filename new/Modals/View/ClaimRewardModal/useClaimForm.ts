import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { useFiatCurrency, useRewards } from 'hooks'
import { useStaking } from 'hooks/contracts'
import { bnum } from 'utils/num'

export type ClaimFormFields = {
  tokensToClaim: string[]
}

export function useClaimForm() {
  const { toFiat } = useFiatCurrency()
  const { rewardTokensList } = useStaking()
  const { rewards } = useRewards()

  const { register, watch } = useForm<ClaimFormFields>({
    mode: 'onChange',
    defaultValues: {
      tokensToClaim: rewardTokensList,
    },
  })

  const tokensToClaim = watch('tokensToClaim')

  const rewardsToClaim = useMemo(() => {
    return tokensToClaim.map(
      (token) => rewards[rewardTokensList.indexOf(token)]
    )
  }, [rewardTokensList, rewards, tokensToClaim])

  return {
    register,
    rewardsToClaim,
    tokensToClaim,
  }
}
