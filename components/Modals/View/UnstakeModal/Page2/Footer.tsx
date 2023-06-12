import { useAtom } from 'jotai'

import { unstakeTxAtom } from 'states/tx'
import { bnum } from 'utils/bnum'
import { useFiat, useStaking } from 'hooks'
import { useUnstake } from './useUnstake'

import { Checkout } from 'components/Modals/shared'
import TxButton from 'components/TxButton'

type UnstakeModalPage2FooterProps = {
  disabled: boolean
  send(event: string): void
  unstakeAmount: string
  rewardFiatValue: string
  stakedTokenBalance: string
  checked?: boolean
}

export default function UnstakeModalPage2Footer({
  disabled,
  send,
  unstakeAmount,
  stakedTokenBalance,
  rewardFiatValue,

  checked = false,
}: UnstakeModalPage2FooterProps) {
  const toFiat = useFiat()
  const { lpToken } = useStaking()

  const [tx, setTx] = useAtom(unstakeTxAtom)

  const _unstake = useUnstake(unstakeAmount, checked)

  const lpFiatValue = toFiat(unstakeAmount, lpToken.address)
  const fiatValue = checked
    ? bnum(lpFiatValue).plus(rewardFiatValue).toString()
    : lpFiatValue

  async function unstake() {
    if (!_unstake) {
      send('FAIL')
      return
    }

    try {
      const txHash = await _unstake()
      if (!txHash) return
      setTx({ hash: txHash, unstakeAmount, stakedTokenBalance })
      send('NEXT')
    } catch (error: any) {
      if (
        error.code === 'ACTION_REJECTED' ||
        error.code === 4001 ||
        error.error === 'Rejected by user'
      ) {
        return
      }

      send('FAIL')
    }
  }

  return (
    <footer className="modalFooter">
      <Checkout
        htmlFor="unstakeAmount"
        amount={fiatValue}
        message="You will get"
        type="fiat"
      />
      <TxButton onClick={unstake} hash={tx.hash} disabled={disabled}>
        Withdraw
      </TxButton>
    </footer>
  )
}
