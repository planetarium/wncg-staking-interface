import Link from 'next/link'
import { useMount } from 'react-use'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { removeLiquidityTxAtom } from 'states/tx'
import { txUrlFor } from 'utils/txUrlFor'
import { useChain, useFiat, useStaking } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'

type RemoveLiquidityToastProps = Required<RemoveLiquidityTx>

export default function RemoveLiquidityToast({
  hash,
  assets,
  amountsOut,
}: RemoveLiquidityToastProps) {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { lpToken, tokens } = useStaking()

  const setTx = useSetAtom(removeLiquidityTxAtom)

  const status = useWatch(hash)

  useMount(() => setTx(RESET))

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(chainId, hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Exit pool
            <Icon icon="outlink" />
          </h3>
          <Status status={status} />
        </Link>
      </header>

      <div className="toastContent">
        <dl className="detailList">
          {amountsOut.map((amt, i) => {
            const addr = assets[i]
            const symbol = tokens[addr]?.symbol ?? ''
            const fiatValue = toFiat(amt, addr)

            return (
              <div className="detailItem" key={`exitToast:${addr}:${amt}`}>
                <dt>
                  <div className="token">
                    <TokenIcon address={addr} $size={20} />
                  </div>
                  {symbol}
                </dt>

                <dd>
                  <NumberFormat value={amt} />
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
        <ImportToken address={lpToken.address} $size="sm" $variant="primary" />
      </footer>
    </StyledToast>
  )
}
