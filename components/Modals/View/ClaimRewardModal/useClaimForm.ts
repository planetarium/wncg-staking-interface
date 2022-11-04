import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { useRewards } from 'hooks'

export type ClaimFormFields = {
  tokensToClaim: string[]
}

export function useClaimForm() {
  const { rewards, rewardTokensList } = useRewards()

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
