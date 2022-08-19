import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { useMachine } from '@xstate/react'

import { poolTokenApprovalsState } from 'app/states/approval'
import { handleError } from 'utils/error'
import { bnum } from 'utils/num'
import { useApprove, useJoinPool } from 'hooks'
import { createInvestMachine } from './investMachine'

export function useInvestMachine(amounts: string[], currentEthType: EthType) {
  const { approveWeth, approveWncg } = useApprove()

  const { joinPool } = useJoinPool()

  const poolTokenApprovals = useRecoilValue(poolTokenApprovalsState)

  const investMachine = useMemo(
    () => createInvestMachine(amounts, poolTokenApprovals, currentEthType),
    [amounts, currentEthType, poolTokenApprovals]
  )

  const [state, send] = useMachine(investMachine)

  const handleSubmit = useCallback(async () => {
    try {
      switch (state.value) {
        case 'approveWncg':
          send('APPROVING_WNCG')
          await approveWncg()
          break
        case 'approveWeth':
          send('APPROVING_WETH')
          await approveWeth()
          break
        case 'invest':
          send('INVESTING')
          await joinPool(amounts, currentEthType)
          break
        default:
          break
      }
    } catch (error) {
      handleError(error)
    }
  }, [
    amounts,
    approveWeth,
    approveWncg,
    currentEthType,
    joinPool,
    send,
    state.value,
  ])

  const stepsToSkip = useMemo(
    () =>
      amounts.map((amount, i) => {
        if (!bnum(amount).isZero()) return false
        if (i === 1 && currentEthType === 'weth') false
        return true
      }),
    [amounts, currentEthType]
  )

  return {
    handleSubmit,
    send,
    state,
    stepsToSkip,
  }
}
