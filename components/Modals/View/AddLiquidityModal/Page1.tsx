import { useAtom } from 'jotai'
import clsx from 'clsx'

import { addLiquidityTxAtom } from 'states/tx'
import { useStaking } from 'hooks'
import { useAddLiquidity } from 'hooks/pancakeswap'

import { StyledAddLiquidityModalPage1 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import NumberFormat from 'components/NumberFormat'
import TxButton from 'components/TxButton'

type AddLiquidityModalPage1Props = {
  amountsIn: string[]
  amountsInFiatValueSum: string
  assets: Hash[]
  userLpAmount: string
  send(value: string): void
}

function AddLiquidityModalPage1({
  assets,
  amountsIn,
  userLpAmount,
  amountsInFiatValueSum,
  send,
}: AddLiquidityModalPage1Props) {
  const { shouldReversePoolTokenOrderOnDisplay, tokens } = useStaking()

  const [tx, setTx] = useAtom(addLiquidityTxAtom)

  const { addLiquidity } = useAddLiquidity(assets, amountsIn)

  async function onClickAddLiquidity() {
    if (!addLiquidity) {
      send('FAIL')
      return
    }

    try {
      const txHash = await addLiquidity?.()
      if (!txHash) return

      setTx({
        hash: txHash,
        amountsIn,
        userLpAmount,
        amountsInFiatValueSum,
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
    <StyledAddLiquidityModalPage1 $disabled={!!tx.hash}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">Join pool</h2>
          <h3 className="subtitle">
            Do you want to join pool?
            <NumberFormat
              className="usd"
              value={amountsInFiatValueSum}
              type="fiat"
              approx={false}
            />
          </h3>
        </div>

        <p
          className={clsx('amountGroup', {
            reverse: shouldReversePoolTokenOrderOnDisplay,
          })}
        >
          {amountsIn.map((amt, i) => {
            const symbol = tokens[assets[i]]?.symbol ?? ''

            return (
              <NumberFormat
                key={`addLiquidityModalPage1:${assets[i]}`}
                value={amt}
                symbol={symbol}
                decimals={8}
              />
            )
          })}
        </p>

        <CloseButton />
      </header>

      <footer className="modalFooter">
        <TxButton onClick={onClickAddLiquidity} hash={tx.hash}>
          Join pool
        </TxButton>
      </footer>

      <PendingNotice hash={tx.hash} />
    </StyledAddLiquidityModalPage1>
  )
}

export default AddLiquidityModalPage1
