import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { bnum } from 'utils/bnum'
import { useFiat, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

export type ClaimFormFields = {
  rewardList: boolean[]
}

export function useClaimForm() {
  const toFiat = useFiat()
  const { rewardTokenAddresses } = useStaking()

  const { earnedRewards = [] } = useFetchUserData().data ?? {}
  const { setValue, watch } = useForm<ClaimFormFields>({
    mode: 'onChange',
    defaultValues: {
      rewardList: earnedRewards.map((amt) => bnum(amt).gt(0)),
    },
  })

  const rewardList = watch('rewardList')

  const totalClaimFiatValue = useMemo(
    () =>
      rewardList
        .reduce((acc, checked, i) => {
          if (!checked) return acc
          const amount = earnedRewards[i]
          const address = rewardTokenAddresses[i]
          return acc.plus(toFiat(amount, address))
        }, bnum(0))
        .toString(),
    [earnedRewards, rewardList, rewardTokenAddresses, toFiat]
  )

  const submitDisabled = useMemo(
    () =>
      earnedRewards.every((amt) => bnum(amt).isZero()) ||
      rewardList.every((c) => !c),
    [earnedRewards, rewardList]
  )

  return {
    rewardList,
    earnedRewards,
    setValue,
    watch,
    submitDisabled,
    totalClaimFiatValue,
  }
}
