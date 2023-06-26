import Link from 'next/link'
import { useMount } from 'react-use'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { exitTxAtom } from 'states/tx'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { formatUnits } from 'utils/formatUnits'
import { txUrlFor } from 'utils/txUrlFor'
import { useChain, useFiat, useStaking } from 'hooks'
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
  isPropExit,
  tokenOutIndex,
}: ExitToast) {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { lpToken, tokens } = useStaking()

  const setTx = useSetAtom(exitTxAtom)

  const status = useWatch(hash)

  const importTokenAddress = isPropExit
    ? lpToken.address
    : tokens[assets[tokenOutIndex]].address !== NATIVE_CURRENCY_ADDRESS
    ? tokens[assets[tokenOutIndex]].address
    : null

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
          {isPropExit ? (
            <div className="detailItem">
              <dt>
                <div className="token">
                  <TokenIcon address={lpToken.address} $size={20} />
                </div>
                {lpToken.name}
              </dt>

              <dd>
                <NumberFormat value={formatUnits(bptIn, lpToken.decimals)} />
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
            })
          )}
        </dl>
      </div>

      {importTokenAddress && (
        <footer className="toastFooter">
          <ImportToken
            address={importTokenAddress}
            $size="sm"
            $variant="primary"
          />
        </footer>
      )}
    </StyledToast>
  )
}
