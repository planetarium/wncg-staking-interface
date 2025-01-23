import { useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai'

import { unstakeTxAtom } from 'states/tx'
import { ToastType } from 'config/constants'
import { useRefetch } from 'hooks'
import { useToast } from 'hooks/useToast'
import { pageFor, unstakeMachine } from './stateMachine'
import { useUnstakeForm } from './useUnstakeForm'
import { useWatch } from './useWatch'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import Page4 from './Page4'

function UnstakeModal() {
  const toast = useToast()
  const refetch = useRefetch({
    userData: true,
    userRewards: true,
  })

  const tx = useAtomValue(unstakeTxAtom)
  const useFormReturns = useUnstakeForm()

  const {
    unstakeAmount: _unstakeAmount,
    stakedTokenBalance: _stakedTokenBalance,
    totalClaimFiatValue: _totalClaimFiatValue,
  } = useFormReturns

  const unstakeAmount = tx.unstakeAmount ?? _unstakeAmount
  const stakedTokenBalance = tx.stakedTokenBalance ?? _stakedTokenBalance
  const totalClaimFiatValue = tx.totalClaimFiatValue ?? _totalClaimFiatValue

  const stateMachine = useRef(unstakeMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash: tx.hash,
    },
  })

  const currentPage = pageFor(state.value)

  useWatch(send)

  useMount(() => {
    refetch()
  })

  useUnmount(() => {
    if (tx.hash) {
      toast<UnstakeTx>({
        type: ToastType.Unstake,
        props: {
          hash: tx.hash,
          unstakeAmount,
          stakedTokenBalance,
        },
      })
    }
  })

  return (
    <>
      {currentPage === 1 && (
        <Page2
          send={send}
          {...useFormReturns}
          stakedTokenBalance={stakedTokenBalance}
          totalClaimFiatValue={totalClaimFiatValue}
          unstakeAmount={unstakeAmount}
        />
      )}
      {currentPage === 2 && <Page3 />}
      {currentPage === 3 && <Page4 />}
    </>
  )
}

export default dynamic(() => Promise.resolve(UnstakeModal), {
  ssr: false,
})
