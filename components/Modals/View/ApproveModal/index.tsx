import { useRef } from 'react'
import { useUnmount } from 'react-use'

import { useMachine } from '@xstate/react'
import { useAtom, useAtomValue } from 'jotai'

import { approveTxAtom } from 'states/tx'
import { hasModalInViewAtom } from 'states/ui'
import { ToastType } from 'config/constants'
import { useRefetch, useToast } from 'hooks'
import { approveMachine, pageFor } from './stateMachine'
import { useApprove } from './useApprove'
import { useWatch } from './useWatch'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

type ApproveModalProps = {
  spender: Hash
  spenderName: string
  tokenAddress: Hash
  tokenSymbol: string
  tokenDecimals: number
  buttonLabel: string
  toastLabel: string
  desc: string
  nextAction: ApproveNextAction
  completeMessage?: string
  titleSuffix?: string
  tokenName?: string
}

export default function ApproveModal({
  spender: _spender,
  spenderName: _spenderName,
  tokenAddress: _tokenAddress,
  tokenSymbol: _tokenSymbol,
  buttonLabel: _buttonLabel,
  desc: _desc,
  toastLabel: _toastLabel,
  tokenDecimals: _tokenDecimals,
  nextAction: _nextAction,
  titleSuffix: _titleSuffix,
  completeMessage: _completeMessage,
  tokenName: _tokenName,
}: ApproveModalProps) {
  const stateMachine = useRef(approveMachine)
  const refetch = useRefetch({ userAllowances: true, userBalances: true })

  const toast = useToast()
  const [tx, setTx] = useAtom(approveTxAtom)
  const hasModalInView = useAtomValue(hasModalInViewAtom)

  const spender = tx.spender ?? _spender
  const spenderName = tx.spenderName ?? _spenderName
  const tokenAddress = tx.tokenAddress ?? _tokenAddress
  const tokenSymbol = tx.tokenSymbol ?? _tokenSymbol
  const desc = tx.desc ?? _desc
  const tokenDecimals = tx.tokenDecimals ?? _tokenDecimals
  const buttonLabel = tx.buttonLabel ?? _buttonLabel
  const toastLabel = tx.toastLabel ?? _toastLabel
  const nextAction = tx.nextAction ?? _nextAction
  const titleSuffix = tx.titleSuffix ?? _titleSuffix
  const completeMessage = tx.completeMessage ?? _completeMessage
  const tokenName = tx.tokenName ?? _tokenName

  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash: tx.hash,
    },
  })

  const currentPage = pageFor(state.value)
  const _approve = useApprove(tokenAddress, spender)

  async function approve() {
    if (!_approve) {
      send('FAIL')
      return
    }

    try {
      const txHash = await _approve()
      if (!txHash) return

      setTx({
        hash: txHash,
        titleSuffix,
        spenderName,
        spender,
        tokenAddress,
        tokenSymbol,
        desc,
        tokenDecimals,
        tokenName,
        nextAction,
        toastLabel,
        buttonLabel,
        completeMessage,
      })
      send('NEXT')
    } catch (error: any) {
      if (
        error.code === 'ACTION_REJECTED' ||
        error.code === 4001 ||
        error.error === 'Rejected by user'
      ) {
        send('ROLLBACK')
        return
      }

      send('FAIL')
    }
  }

  useWatch(send)

  useUnmount(() => {
    refetch()

    if (tx.hash && !hasModalInView) {
      toast<ApproveTx>({
        type: ToastType.Approve,
        props: {
          hash: tx.hash,
          toastLabel,
          tokenAddress,
          tokenSymbol,
        },
      })
    }
  })

  return (
    <>
      {currentPage === 1 && (
        <Page1
          spenderName={spenderName}
          address={tokenAddress}
          symbol={tokenSymbol}
          hash={tx.hash}
          approve={approve}
          toastLabel={toastLabel}
        />
      )}

      {currentPage === 2 && (
        <Page2
          buttonLabel={buttonLabel}
          nextAction={nextAction}
          send={send}
          tokenAddress={tokenAddress}
          tokenSymbol={tokenSymbol}
        />
      )}

      {currentPage === 3 && <Page3 />}
    </>
  )
}
