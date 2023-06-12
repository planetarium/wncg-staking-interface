import { memo } from 'react'
import { useAtom } from 'jotai'

import { stakeTxAtom } from 'states/tx'
import { useFiat, useStaking } from 'hooks'
import { useStake } from './useStake'

import { StyledStakeModalPage1 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import NumberFormat from 'components/NumberFormat'
import TxButton from 'components/TxButton'

type StakeModalPage1Props = {
  stakeAmount: string
  stakedTokenBalance: string
  send(value: string): void
}

function StakeModalPage1({
  stakeAmount,
  stakedTokenBalance,
  send,
}: StakeModalPage1Props) {
  const toFiat = useFiat()
  const { lpToken } = useStaking()
  const _stake = useStake(stakeAmount)

  const [tx, setTx] = useAtom(stakeTxAtom)

  const fiatValue = toFiat(stakeAmount, lpToken.address)

  async function stake() {
    if (!_stake) {
      send('FAIL')
      return
    }

    try {
      const txHash = await _stake()
      if (!txHash) return

      setTx({
        hash: txHash,
        stakeAmount,
        stakedTokenBalance,
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

  return (
    <StyledStakeModalPage1 $disabled={!!tx.hash}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">LP token({lpToken.name}) staking</h2>
          <h3 className="subtitle">
            Do you want to stake?
            <strong className="amount">
              <NumberFormat value={stakeAmount} decimals={8} symbol="LP" />
              <strong className="parenthesis">
                <NumberFormat
                  className="usdValue"
                  value={fiatValue}
                  type="fiat"
                />
              </strong>
            </strong>
          </h3>
        </div>

        <p className="desc">
          You have to go through the cooldown period to withdraw your staked
          tokens.
        </p>

        <CloseButton />
      </header>

      <footer className="modalFooter">
        <TxButton onClick={stake} hash={tx.hash}>
          Stake
        </TxButton>
      </footer>

      <PendingNotice hash={tx.hash} />
    </StyledStakeModalPage1>
  )
}

export default memo(StakeModalPage1)
