import { useMemo } from 'react'
import { UseFormWatch } from 'react-hook-form'
import { useAtom } from 'jotai'

import { exitTxAtom } from 'states/tx'
import { bnum } from 'utils/bnum'
import { LiquidityFieldType } from 'config/constants'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useBalances, useChain, useFiat, useStaking } from 'hooks'
import { useExactInExit, useExactOutExit } from 'hooks/balancer'
import { ExitFormFields } from 'hooks/balancer/useExitForm'

import { Checkout } from 'components/Modals/shared'
import TxButton from 'components/TxButton'

type ExitModalPage1FooterProps = {
  bptIn: string
  send(value: string): void
  watch: UseFormWatch<ExitFormFields>
  submitDisabled: boolean
}

function ExitModalPage1Footer({
  bptIn,
  send,
  watch,
  submitDisabled,
}: ExitModalPage1FooterProps) {
  const balanceOf = useBalances()
  const toFiat = useFiat()
  const { lpToken, tokens } = useStaking()

  const [tx, setTx] = useAtom(exitTxAtom)

  const exitType = watch('exitType')

  const tokenOut = exitType != null ? tokens[exitType] : null

  const amountOut = watch(LiquidityFieldType.ExitAmount)
  const pcnt = watch(LiquidityFieldType.LiquidityPercent)
  const bptOutPcnt = bnum(pcnt).toString()

  const { exactInExit } = useExactInExit()
  const { exactOutExit } = useExactOutExit()

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
      let txHash

      if (exitType == null) txHash = await exactInExit(bptOutPcnt)
      else txHash = await exactOutExit(tokenOut!, amountOut)

      if (!txHash) throw Error('No txHash')

      setTx({
        bptOutPcnt,
        exitType,
        hash: txHash,
        bptIn,
        amountOut,
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
