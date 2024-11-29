import { useAtom } from 'jotai'
import clsx from 'clsx'

import { joinTxAtom } from 'states/tx'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { bnum } from 'utils/bnum'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useStaking } from 'hooks'
import { useJoinPool } from 'hooks/balancer'

import { StyledJoinModalPage1 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import NumberFormat from 'components/NumberFormat'
import TxButton from 'components/TxButton'

type JoinModalPage1Props = {
  assets: Hash[]
  joinAmounts: `${number}`[]
  lpBalance: string
  totalJoinFiatValue: string
  send(value: string): void
}

function JoinModalPage1({
  assets,
  joinAmounts,
  lpBalance,
  totalJoinFiatValue,
  send,
}: JoinModalPage1Props) {
  const [tx, setTx] = useAtom(joinTxAtom)
  const { shouldReversePoolTokenOrderOnDisplay, tokens } = useStaking()

  const nativeAssetIndex = assets.findIndex(
    (addr) => addr === NATIVE_CURRENCY_ADDRESS
  )
  const hasNativeAsset =
    nativeAssetIndex >= 0 && bnum(joinAmounts[nativeAssetIndex]).gt(0)

  const { joinPool: _join } = useJoinPool(hasNativeAsset)

  async function join() {
    try {
      if (!_join) {
        throw Error('No writeAsync')
      }

      const txHash = await _join(joinAmounts)
      if (!txHash) throw Error('No txHash')

      setTx({
        hash: txHash,
        joinAmounts,
        lpBalance: lpBalance,
        totalJoinFiatValue,
      })

      send('NEXT')
    } catch (error: any) {
      walletErrorHandler(error, () => send('FAIL'))
      send('ROLLBACK')
    }
  }

  return (
    <StyledJoinModalPage1 $disabled={!!tx.hash}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">Join pool</h2>
          <h3 className="subtitle">
            Do you want to join pool?
            <NumberFormat
              className="usd"
              value={totalJoinFiatValue}
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
          {joinAmounts.map((amt, i) => {
            const symbol = tokens[assets[i]]?.symbol ?? ''

            return (
              <NumberFormat
                key={`joinModalPage1:${assets[i]}`}
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
        <TxButton onClick={join} hash={tx.hash}>
          Join pool
        </TxButton>
      </footer>

      <PendingNotice hash={tx.hash} />
    </StyledJoinModalPage1>
  )
}

export default JoinModalPage1
