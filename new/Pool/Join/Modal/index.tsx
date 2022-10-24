import { useEffect, useMemo, useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useTransaction } from 'wagmi'

import { pendingJoinTxAtom } from 'states/form'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { useFiatCurrency } from 'hooks'
import { currentPage, joinMachine } from './stateMachine'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import Page4 from './Page4'
import { getTokenSymbol } from 'utils/token'

const log = createLogger('black')

type JoinModalProps = {
  amounts: string[]
  assets: string[]
  resetForm(): void
  tokensToApprove: string[]
}

function JoinModal({
  amounts,
  assets,
  resetForm,
  tokensToApprove,
}: JoinModalProps) {
  const { toFiat } = useFiatCurrency()
  const [pendingTx, setPendingTx] = useAtom(pendingJoinTxAtom)
  const {
    amounts: pendingAmounts,
    assets: pendingAssets,
    approving,
    tokensToApprove: pendingTokensToApprove,
    hash,
  } = pendingTx

  amounts = pendingAmounts ?? amounts
  assets = pendingAssets ?? assets
  tokensToApprove = pendingTokensToApprove ?? tokensToApprove

  const stateMachine = useRef(joinMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      amounts,
      assets,
      hash,
      tokensToApprove,
    },
  })
  const currentState = state.value as string

  useTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Join tx: ${hash?.slice(0, 6)}`)
    },
    async onSuccess(response: TransactionResponse) {
      console.log('RESPONSE:', response)
      if (!response) return
      try {
        const data = await response.wait()
        console.log('✅ SUCCESS from:', 0)
        send('SUCCESS')
        if (assets.includes(data.to.toLowerCase())) {
          setPendingTx((prev) => {
            const newTokensToApprove = [...(prev.tokensToApprove ?? [])]
            newTokensToApprove.shift()

            return {
              ...prev,
              tokensToApprove: newTokensToApprove,
            }
          })
        }
      } catch (error) {
        console.log(777777777, 'on success catch error')
        console.log('🔥 FAIL from:', 0)
        console.log('Failed reason:', 0, error)
        send('FAIL')
      }
    },
    onError() {
      console.log(555555555, 'on error')
      setPendingTx({
        hash: undefined,
      })
      stateMachine.current.transition(state.value, { type: 'ROLLBACK' })
    },
  })

  const joinAmountsInFiatValue = amounts
    .reduce((total, amount, i) => {
      return total.plus(toFiat(assets[i], amount))
    }, bnum(0))
    .toNumber()

  const page = useMemo(() => currentPage(state.value), [state.value])

  const tokenToApprove = state.context.tokensToApprove[0]

  // NOTE: Reset hash when join tx is fulfilled
  useEffect(() => {
    if (currentState === `approveSuccess`) {
      setPendingTx((prev) => ({
        ...prev,
        hash: undefined,
      }))
    }
  }, [currentState, setPendingTx])

  // NOTE: Reset everything when 1) tx failed 2) joined
  useUnmount(() => {
    if (!!state.done) {
      setPendingTx(RESET)
      resetForm()
    }
  })

  return (
    <>
      <span style={{ background: 'purple' }}>
        {' '}
        ➡ {currentState.slice(0, 20)}
      </span>
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <span style={{ color: 'red' }}>
        Hash (Local storage) : {hash?.slice(0, 6) ?? typeof hash}
      </span>
      <hr />
      <span style={{ background: 'green' }}>
        Hash (StateMachine):{' '}
        {state.context.hash?.slice(0, 6) ?? typeof state.context.hash}
      </span>
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <span style={{ color: 'yellow' }}>
        tokensToApproves (StateMachine) :{' '}
        {JSON.stringify(
          state.context.tokensToApprove.map((addr) => addr.slice(0, 6))
        )}
      </span>
      <hr />
      <span>
        tokensToApproves (Modal):{' '}
        {JSON.stringify(tokensToApprove.map((addr) => addr.slice(0, 6)))}
      </span>
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <span style={{ color: 'yellow' }}>
        Join amounts (StateMachine) : {JSON.stringify(state.context.amounts)}
      </span>
      <hr />
      <span>Join amounts (Modal) : {JSON.stringify(amounts)}</span>
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <span>
        TokensToApprove : {JSON.stringify(getTokenSymbol(tokenToApprove))}
      </span>
      <hr />
      <span>Approving Saved: {JSON.stringify(getTokenSymbol(approving))}</span>
      <hr />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Page1
        address={tokenToApprove}
        currentPage={page}
        send={send}
        tokensToApprove={tokensToApprove}
        isPending={currentState.startsWith('approvePending')}
      />
      <Page2
        address={tokenToApprove}
        approvals={state.context.tokensToApprove}
        currentPage={page}
        send={send}
      />
      <Page3
        amounts={amounts}
        assets={assets}
        currentPage={page}
        fiatValue={joinAmountsInFiatValue}
        send={send}
        isPending={currentState === 'joinPending'}
      />
      <Page4 currentPage={page} currentState={state.value} send={send} />
    </>
  )
}

export default JoinModal
