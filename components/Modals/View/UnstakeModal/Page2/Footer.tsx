import { useAtom } from 'jotai'

import { unstakeTxAtom } from 'states/tx'
import { bnum } from 'utils/bnum'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useFiat, useStaking } from 'hooks'
import { useUnstake } from './useUnstake'

import { Checkout } from 'components/Modals/shared'
import TxButton from 'components/TxButton'

type UnstakeModalPage2FooterProps = {
  disabled: boolean
  send: XstateSend
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

  const lpFiatValue = toFiat(unstakeAmount, lpToken?.address)
  const fiatValue = checked
    ? bnum(lpFiatValue).plus(rewardFiatValue).toString()
    : lpFiatValue

  async function unstake() {
    try {
      if (!_unstake) {
        throw Error('No writeAsync')
      }

      const txHash = await _unstake()
      if (!txHash) throw Error('No txHash')

      setTx({ hash: txHash, unstakeAmount, stakedTokenBalance })
      send('NEXT')
    } catch (error: any) {
      walletErrorHandler(error, () => send('FAIL'))
      send('ROLLBACK')
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
