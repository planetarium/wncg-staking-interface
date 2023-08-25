import { useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import dynamic from 'next/dynamic'
import { useMachine } from '@xstate/react'
import { useAtomValue } from 'jotai'

import { claimTxAtom } from 'states/tx'
import { ToastType } from 'config/constants'
import { useRefetch, useToast } from 'hooks'
import { useClaimForm } from './useClaimForm'
import { useWatch } from './useWatch'
import { claimMachine, pageFor } from './stateMachine'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

function ClaimModal() {
  const toast = useToast()
  const refetch = useRefetch({ userRewards: true })

  const tx = useAtomValue(claimTxAtom)

  const {
    rewardList: _rewardList,
    earnedTokenRewards: _earnedTokenRewards,
    setValue,
    submitDisabled,
    totalClaimFiatValue: _totalClaimFiatValue,
  } = useClaimForm()

  const hash = tx.hash
  const earnedTokenRewards = tx.earnedTokenRewards ?? _earnedTokenRewards
  const rewardList = tx.rewardList ?? _rewardList
  const totalClaimFiatValue = tx.totalClaimFiatValue ?? _totalClaimFiatValue

  const stateMachine = useRef(claimMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
    },
  })

  const currentPage = pageFor(state.value)

  useWatch(send)

  useMount(() => {
    refetch()
  })

  useUnmount(() => {
    if (hash) {
      toast<ClaimTx>({
        type: ToastType.Claim,
        props: {
          hash,
          earnedTokenRewards,
          rewardList,
        },
      })
    }
  })

  return (
    <>
      {currentPage === 1 && (
        <Page1
          rewardList={rewardList}
          send={send}
          earnedTokenRewards={earnedTokenRewards}
          setValue={setValue}
          submitDisabled={submitDisabled}
          totalClaimFiatValue={totalClaimFiatValue}
        />
      )}

      {currentPage === 2 && <Page2 rewardList={rewardList} />}

      {currentPage === 3 && <Page3 />}
    </>
  )
}

export default dynamic(() => Promise.resolve(ClaimModal), { ssr: false })
