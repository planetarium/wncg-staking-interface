import { memo } from 'react'
import { useAtomValue } from 'jotai'

import { unstakeTxAtom } from 'states/tx'
import type { UseUnstakeFormReturns } from '../useUnstakeForm'

import { StyledUnstakeModalPage2 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import Footer from './Footer'
import Form from './Form'

type UnstakeModalPage2Props = {
  send(event: string): void
} & UseUnstakeFormReturns

function UnstakeModalPage2({ send, ...props }: UnstakeModalPage2Props) {
  const {
    checked,
    unstakeAmount,
    submitDisabled,
    stakedTokenBalance,
    totalClaimFiatValue,
  } = props

  const tx = useAtomValue(unstakeTxAtom)

  const disabled = !!tx.hash

  return (
    <StyledUnstakeModalPage2 $disabled={disabled}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">Withdraw</h2>
          <h3 className="subtitle">How much would you withdraw?</h3>
        </div>

        <CloseButton />
      </header>

      <div className="container">
        <div className="modalContent">
          <Form
            {...props}
            disabled={disabled}
            totalClaimFiatValue={totalClaimFiatValue}
          />
        </div>
      </div>

      <Footer
        send={send}
        unstakeAmount={unstakeAmount}
        checked={checked}
        disabled={submitDisabled || disabled}
        rewardFiatValue={totalClaimFiatValue}
        stakedTokenBalance={stakedTokenBalance}
      />

      <PendingNotice hash={tx.hash} />
    </StyledUnstakeModalPage2>
  )
}

export default memo(UnstakeModalPage2)
