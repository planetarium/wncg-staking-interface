import { memo } from 'react'
import { UseFormWatch } from 'react-hook-form'
import { useAtom } from 'jotai'

import { exitTxAtom } from 'states/tx'
import { LiquidityFieldType } from 'config/constants'
import { useExitPool } from 'hooks'
import { ExitFormFields } from 'hooks/useExitForm'

import { Checkout } from 'components/Modals/shared'
import TxButton from 'components/TxButton'

type ExitModalPage1FooterProps = {
  assets: Hash[]
  bptIn: string
  exactOut: boolean
  exitAmounts: string[]
  send(value: string): void
  submitDisabled: boolean
  totalExitFiatValue: string
  watch: UseFormWatch<ExitFormFields>
}

function ExitModalPage1Footer({
  assets,
  bptIn,
  exactOut,
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
    exactOut,
  })

  async function exitPool() {
    if (!_exitPool) {
      send('FAIL')
      return
    }

    try {
      const txHash = await _exitPool()
      if (!txHash) return

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
    <footer className="modalFooter">
      <Checkout amount={totalExitFiatValue} message="You can get" type="fiat" />

      <TxButton onClick={exitPool} disabled={submitDisabled} hash={tx.hash}>
        Exit pool
      </TxButton>
    </footer>
  )
}

export default memo(ExitModalPage1Footer)
