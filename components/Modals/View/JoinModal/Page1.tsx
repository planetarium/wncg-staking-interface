import { memo } from 'react'
import { useAtom } from 'jotai'

import { joinTxAtom } from 'states/tx'
import config from 'config'
import { bnum } from 'utils/bnum'
import { useJoinPool, useStaking } from 'hooks'

import { StyledJoinModalPage1 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import NumberFormat from 'components/NumberFormat'
import TxButton from 'components/TxButton'
import clsx from 'clsx'

type JoinModalPage1Props = {
  assets: Hash[]
  joinAmounts: string[]
  bptBalance: string
  totalJoinFiatValue: string
  send(value: string): void
}

function JoinModalPage1({
  assets,
  joinAmounts,
  bptBalance,
  totalJoinFiatValue,
  send,
}: JoinModalPage1Props) {
  const [tx, setTx] = useAtom(joinTxAtom)
  const { shouldReversePoolTokenOrderOnDisplay, tokenMap } = useStaking()

  const nativeAssetIndex = assets.findIndex(
    (addr) => addr === config.nativeCurrency.address
  )
  const hasNativeAsset =
    nativeAssetIndex >= 0 && bnum(joinAmounts[nativeAssetIndex]).gt(0)

  const _join = useJoinPool(assets, joinAmounts, hasNativeAsset)

  async function join() {
    if (!_join) {
      send('FAIL')
      return
    }

    try {
      const txHash = await _join()
      if (!txHash) return

      setTx({
        hash: txHash,
        joinAmounts,
        bptBalance,
        totalJoinFiatValue,
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
            const { symbol, address } = tokenMap[assets[i]]

            return (
              <NumberFormat
                key={`joinModalPage1:${address}`}
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

export default memo(JoinModalPage1)
