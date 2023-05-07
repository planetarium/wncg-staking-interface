import Link from 'next/link'
import { useMount } from 'react-use'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { exitTxAtom } from 'states/tx'
import config from 'config'
import { formatUnits } from 'utils/formatUnits'
import { txUrlFor } from 'utils/txUrlFor'
import { useFiat, useStaking } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'

type ExitToast = Required<ExitTx>

export default function ExitToast({
  hash,
  assets,
  totalExitFiatValue,
  bptIn,
  exitAmounts,
  isProportional,
  tokenOutIndex,
}: ExitToast) {
  const toFiat = useFiat()
  const { bptName, stakedTokenAddress, tokenMap } = useStaking()
  const { decimals: stakedTokenDecimals, symbol: stakedTokenSymbol } =
    tokenMap[stakedTokenAddress]

  const setTx = useSetAtom(exitTxAtom)

  const status = useWatch(hash)

  const importTokenConfig = isProportional
    ? {
        address: stakedTokenAddress,
        decimals: stakedTokenDecimals,
        name: bptName,
        symbol: stakedTokenSymbol,
      }
    : tokenMap[assets[tokenOutIndex]].address !== config.nativeCurrency.address
    ? {
        address: tokenMap[assets[tokenOutIndex]].address,
        decimals: tokenMap[assets[tokenOutIndex]].decimals,
        symbol: tokenMap[assets[tokenOutIndex]].symbol,
      }
    : null

  useMount(() => setTx(RESET))

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Exit pool
            <Icon icon="outlink" />
          </h3>
          <Status status={status} />
        </Link>
      </header>

      <div className="toastContent">
        <dl className="detailList">
          {isProportional ? (
            <div className="detailItem">
              <dt>
                <div className="token">
                  <TokenIcon address={stakedTokenAddress} $size={20} />
                </div>
                {bptName}
              </dt>

              <dd>
                <NumberFormat value={formatUnits(bptIn, stakedTokenDecimals)} />
                <NumberFormat
                  className="usd"
                  value={totalExitFiatValue}
                  type="fiat"
                  abbr
                />
              </dd>
            </div>
          ) : (
            exitAmounts.map((amt, i) => {
              if (i !== tokenOutIndex) return null

              const addr = assets[i]
              const { symbol } = tokenMap[addr]
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
            })
          )}
        </dl>
      </div>

      {importTokenConfig && (
        <footer className="toastFooter">
          <ImportToken {...importTokenConfig} $size="sm" $variant="primary" />
        </footer>
      )}
    </StyledToast>
  )
}
