import { useMemo } from 'react'
import { UseFormWatch } from 'react-hook-form'
import { useAtom } from 'jotai'

import { exitTxAtom } from 'states/tx'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useBalances, useFiat, useStaking } from 'hooks'
import {
  useProportionalExit,
  useExactOutExit,
  useSingleMaxExit,
} from 'hooks/balancer'
import { ExitFormFields } from 'hooks/balancer/useExitForm'

import { Checkout } from 'components/Modals/shared'
import TxButton from 'components/TxButton'

type ExitModalPage1FooterProps = {
  bptIn: string
  send(value: string): void
  watch: UseFormWatch<ExitFormFields>
  submitDisabled: boolean
  singleExitMaxAmounts: string[]
  tokenOutIndex: number
}

function ExitModalPage1Footer({
  bptIn,
  send,
  watch,
  submitDisabled,
  singleExitMaxAmounts,
  tokenOutIndex,
}: ExitModalPage1FooterProps) {
  const balanceOf = useBalances()
  const toFiat = useFiat()
  const { lpToken, tokens } = useStaking()

  const [tx, setTx] = useAtom(exitTxAtom)

  const exitType = watch('exitType')
  const tokenOut = exitType != null ? tokens[exitType] : null
  const maxAmountOut =
    exitType != null ? singleExitMaxAmounts[tokenOutIndex] : '0'

  const amountOut = watch(LiquidityFieldType.ExitAmount)
  const pcnt = watch(LiquidityFieldType.LiquidityPercent)
  const bptOutPcnt = bnum(pcnt).toString()

  const { exitPool: proportionalExit } = useProportionalExit()
  const { exactOutExit } = useExactOutExit()
  const { singleMaxExit } = useSingleMaxExit()

  const totalExitFiatValue = useMemo(() => {
    if (exitType == null)
      return toFiat(balanceOf(lpToken.address), lpToken.address)
    return toFiat(amountOut, tokenOut?.address!)
  }, [
    amountOut,
    balanceOf,
    exitType,
    lpToken.address,
    toFiat,
    tokenOut?.address,
  ])

  async function exitPool() {
    if (submitDisabled) return

    try {
      let txHash: Hash | undefined

      switch (true) {
        case exitType == null:
          txHash = await proportionalExit(bptOutPcnt)
          break
        case exitType !== NATIVE_CURRENCY_ADDRESS &&
          bnum(amountOut).eq(maxAmountOut):
          txHash = await singleMaxExit(exitType)
          break
        default:
          txHash = await exactOutExit(tokenOut!, amountOut)
          break
      }

      if (!txHash) throw Error('No txHash')

      setTx({
        hash: txHash,
        bptOutPcnt,
        amountOut,
        bptIn,
        exitType,
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
