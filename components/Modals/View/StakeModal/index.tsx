import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { useMachine } from '@xstate/react'
import { useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'

import { isUnstakeWindowAtom } from 'states/account'
import { stakeTxAtom } from 'states/tx'
import { ToastType } from 'config/constants'
import { useToast } from 'hooks'
import { useFetchUserData } from 'hooks/queries'
import { useWatch } from './useWatch'
import { pageFor, stakeMachine } from './stateMachine'

import Page0 from './Page0'
import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

type StakeModalProps = {
  stakeAmount: string
  resetForm(): void
}

function StakeModal({ stakeAmount: _stakeAmount, resetForm }: StakeModalProps) {
  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}
  const toast = useToast()

  const tx = useAtomValue(stakeTxAtom)

  const stakeAmount = tx.stakeAmount ?? _stakeAmount
  const hash = tx.hash
  const isUnstakeWindow = useAtomValue(isUnstakeWindowAtom)

  const stateMachine = useRef(stakeMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
      unstakeWindow: isUnstakeWindow,
    },
  })

  const currentPage = pageFor(state.value)

  useUnmount(() => {
    resetForm()

    if (hash) {
      toast<StakeTx>({
        type: ToastType.Stake,
        props: {
          hash,
          stakeAmount,
          stakedTokenBalance,
        },
      })
    }
  })

  useWatch(send)

  return (
    <>
      {currentPage === 0 && <Page0 send={send} />}
      {currentPage === 1 && (
        <Page1
          stakeAmount={stakeAmount}
          stakedTokenBalance={stakedTokenBalance}
          send={send}
        />
      )}
      {currentPage === 2 && <Page2 resetForm={resetForm} />}
      {currentPage === 3 && <Page3 />}
    </>
  )
}

export default dynamic(() => Promise.resolve(StakeModal), { ssr: false })
