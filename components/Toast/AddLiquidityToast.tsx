import { useState } from 'react'
import { useMount } from 'react-use'
import Link from 'next/link'
import { useWaitForTransaction } from 'wagmi'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import clsx from 'clsx'

import { addLiquidityTxAtom } from 'states/tx'
import { formatUnits } from 'utils/formatUnits'
import { parseLog } from 'utils/parseLog'
import { txUrlFor } from 'utils/txUrlFor'
import { useChain, useFiat, useStaking } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'

type AddLiquidityToastProps = Required<AddLiquidityTx>

export default function AddLiquidityToast({
  hash,
  assets,
  amountsIn,
}: AddLiquidityToastProps) {
  const [actualAmountsIn, setActualAmountsIn] = useState(amountsIn)

  const { chainId } = useChain()
  const toFiat = useFiat()
  const {
    lpToken,
    poolTokenDecimals,
    shouldReversePoolTokenOrderOnDisplay,
    tokens,
  } = useStaking()

  const setTx = useSetAtom(addLiquidityTxAtom)

  const status = useWatch(hash)

  useMount(() => setTx(RESET))

  useWaitForTransaction({
    hash,
    enabled: !!hash,
    chainId,
    suspense: false,
    async onSuccess(tx) {
      const mintedLog = tx.logs
        .map((l) => parseLog(l))
        .find((l) => l?.name === 'Mint')

      if (!mintedLog) return

      const _amountsIn = mintedLog.args?.flatMap((arg, i) => {
        if (typeof arg === 'string') return []
        return [formatUnits(arg, poolTokenDecimals[i])]
      })

      setActualAmountsIn(_amountsIn)
    },
  })

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(chainId, hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Join pool
            <Icon icon="outlink" />
          </h3>
          <Status status={status} />
        </Link>
      </header>

      <div className="toastContent">
        <dl
          className={clsx('detailList', {
            reverse: shouldReversePoolTokenOrderOnDisplay,
          })}
        >
          {actualAmountsIn.map((amt, i) => {
            const addr = assets[i]
            const fiatValue = toFiat(amt, addr)
            const { address, symbol } = tokens?.[addr] ?? {}

            return (
              <div
                className="detailItem"
                key={`addLiquidityToast:${address}:${amt}`}
              >
                <dt>
                  <div className="token">
                    <TokenIcon address={address} $size={20} />
                  </div>
                  {symbol}
                </dt>
                <dd>
                  <NumberFormat value={amt} decimals={8} />
                  <NumberFormat
                    className="usd"
                    value={fiatValue}
                    type="fiat"
                    abbr
                  />
                </dd>
              </div>
            )
          })}
        </dl>
      </div>

      <footer className="toastFooter">
        <ImportToken address={lpToken?.address} $size="sm" $variant="primary" />
      </footer>
    </StyledToast>
  )
}
