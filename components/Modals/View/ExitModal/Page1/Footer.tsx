import { useAtom } from 'jotai'
import { UseFormWatch } from 'react-hook-form'

import { useProportionalExit } from 'hooks/balancer'
import { ExitFormFields } from 'hooks/balancer/useExitForm'
import { exitTxAtom } from 'states/tx'
import { walletErrorHandler } from 'utils/walletErrorHandler'

import { Checkout } from 'components/Modals/shared'
import TxButton from 'components/TxButton'

type ExitModalPage1FooterProps = {
  send(value: string): void
  watch: UseFormWatch<ExitFormFields>
  submitDisabled: boolean
  amountIn: `${number}`
  totalExitFiatValue: `${number}`
}

function ExitModalPage1Footer({
  send,
  watch,
  submitDisabled,
  amountIn,
  totalExitFiatValue,
}: ExitModalPage1FooterProps) {
  const [tx, setTx] = useAtom(exitTxAtom)

  const useNative = watch('UseNative')

  const { exitPool: _exitPool } = useProportionalExit()

  async function exitPool() {
    if (submitDisabled) return

    try {
      const txHash = await _exitPool(amountIn, useNative)

      if (!txHash) throw Error('No txHash')

      setTx({
        hash: txHash,
        amountIn: amountIn,
        isNative: useNative,
      })
      send('NEXT')
    } catch (error: any) {
      walletErrorHandler(error, () => send('FAIL'))
      send('ROLLBACK')
    }
  }

  return (
    <footer className="modalFooter">
      <Checkout amount={totalExitFiatValue} message="You can get" type="fiat" />

      <TxButton onClick={exitPool} disabled={submitDisabled} hash={tx.hash}>
        Exit pool
      </TxButton>
    </footer>
  )
}

export default ExitModalPage1Footer
