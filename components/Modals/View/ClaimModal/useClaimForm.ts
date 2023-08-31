import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { bnum } from 'utils/bnum'
import { useFiat, useStaking } from 'hooks'
import { useFetchUserRewards } from 'hooks/queries'

export type ClaimFormFields = {
  rewardList: boolean[]
}

export function useClaimForm() {
  const toFiat = useFiat()
  const { rewardTokenAddresses } = useStaking()

  const { earnedTokenRewards = [] } = useFetchUserRewards().data ?? {}
  const { setValue, watch } = useForm<ClaimFormFields>({
    mode: 'onChange',
    defaultValues: {
      rewardList: earnedTokenRewards.map((amt) => bnum(amt).gt(0)),
    },
  })

  const rewardList = watch('rewardList')

  const totalClaimFiatValue = useMemo(
    () =>
      rewardList
        .reduce((acc, checked, i) => {
          if (!checked) return acc
          const amount = earnedTokenRewards[i]
          const address = rewardTokenAddresses[i]
          return acc.plus(toFiat(amount, address))
        }, bnum(0))
        .toString(),
    [earnedTokenRewards, rewardList, rewardTokenAddresses, toFiat]
  )

  const submitDisabled = useMemo(
    () =>
      earnedTokenRewards.every((amt) => bnum(amt).isZero()) ||
      rewardList.every((c) => !c),
    [earnedTokenRewards, rewardList]
  )

  return {
    rewardList,
    earnedTokenRewards,
    setValue,
    watch,
    submitDisabled,
    totalClaimFiatValue,
  }
}
