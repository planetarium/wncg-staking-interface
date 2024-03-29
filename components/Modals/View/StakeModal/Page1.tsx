import { useAtom, useSetAtom } from 'jotai'

import { stakeTxAtom } from 'states/tx'
import { isEthereum } from 'utils/isEthereum'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useChain, useFiat, useStaking } from 'hooks'
import { useStake } from './useStake'

import { StyledStakeModalPage1 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import NumberFormat from 'components/NumberFormat'
import TxButton from 'components/TxButton'
import { stakingErrorAtom } from './useWatch'

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
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { lpToken } = useStaking()
  const { stake: _stake, error } = useStake(stakeAmount)

  const [tx, setTx] = useAtom(stakeTxAtom)
  const setError = useSetAtom(stakingErrorAtom)

  const fiatValue = toFiat(stakeAmount, lpToken?.address)

  async function stake() {
    try {
      if (error === 'INSUFFICIENT_ALLOWANCE') {
        throw Error('INSUFFICIENT_ALLOWANCE')
      }

      if (!_stake) throw Error()

      const txHash = await _stake()
      if (!txHash) throw Error()

      setTx({
        hash: txHash,
        stakeAmount,
        stakedTokenBalance,
      })

      send('NEXT')
    } catch (error: any) {
      walletErrorHandler(error, () => {
        setError(error)
        send('FAIL')
      })
      send('ROLLBACK')
    }
  }

  return (
    <StyledStakeModalPage1 $disabled={!!tx.hash}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">LP token({lpToken?.name}) staking</h2>
          <h3 className="subtitle">
            Do you want to stake?
            <strong className="amount">
              <NumberFormat
                value={stakeAmount}
                decimals={8}
                symbol={isEthereum(chainId) ? 'LP' : 'Cake-LP'}
              />
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

export default StakeModalPage1
