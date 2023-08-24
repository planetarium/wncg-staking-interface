import { UseFormWatch } from 'react-hook-form'
import { useAtom } from 'jotai'

import { exitTxAtom } from 'states/tx'
import { LiquidityFieldType } from 'config/constants'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useExitPool } from 'hooks/balancer'
import { ExitFormFields } from 'hooks/balancer/useExitForm'

import { Checkout } from 'components/Modals/shared'
import TxButton from 'components/TxButton'

type ExitModalPage1FooterProps = {
  assets: Hash[]
  bptIn: string
  isExactOut: boolean
  exitAmounts: string[]
  send(value: string): void
  submitDisabled: boolean
  totalExitFiatValue: string
  watch: UseFormWatch<ExitFormFields>
}

function ExitModalPage1Footer({
  assets,
  bptIn,
  isExactOut,
  exitAmounts,
  submitDisabled,
  send,
  totalExitFiatValue,
  watch,
}: ExitModalPage1FooterProps) {
  const [tx, setTx] = useAtom(exitTxAtom)

  const exitType = watch('exitType')
  const bptOutPcnt = watch(LiquidityFieldType.LiquidityPercent)

  const _exitPool = useExitPool({
    assets,
    exitType,
    exitAmounts,
    bptOutPcnt,
    isExactOut,
  })

  async function exitPool() {
    try {
      if (!_exitPool) {
        throw Error('No writeAsync')
      }

      const txHash = await _exitPool()
      if (!txHash) throw Error('No txHash')

      setTx({
        assets,
        bptOutPcnt,
        exitType,
        hash: txHash,
        exitAmounts,
        bptIn,
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
