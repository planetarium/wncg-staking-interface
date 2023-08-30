import Link from 'next/link'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { exitTxAtom } from 'states/tx'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { txUrlFor } from 'utils/txUrlFor'
import { useClientMount, useChain, useFiat, useStaking } from 'hooks'
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
  bptIn,
  amountOut,
  exitType,
}: ExitToast) {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { lpToken, tokens } = useStaking()

  const setTx = useSetAtom(exitTxAtom)

  const status = useWatch(hash)

  const importTokenAddress =
    exitType == null
      ? lpToken?.address
      : exitType !== NATIVE_CURRENCY_ADDRESS
      ? exitType
      : null

  const bptInFiatValue = toFiat(bptIn ?? '0', lpToken.address)

  useClientMount(() => setTx(RESET))

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
          {exitType == null && (
            <div className="detailItem">
              <dt>
                <div className="token">
                  <TokenIcon address={lpToken?.address} $size={20} />
                </div>
                {lpToken?.name}
              </dt>

              <dd>
                <NumberFormat value={bptIn} />
                <NumberFormat
                  className="usd"
                  value={bptInFiatValue}
                  type="fiat"
                  abbr
                />
              </dd>
            </div>
          )}

          {exitType != null && !!amountOut && (
            <div className="detailItem">
              <dt>
                <TokenIcon address={exitType!} $size={20} />
                {tokens[exitType!].symbol}
              </dt>

              <dd>
                <NumberFormat value={amountOut} />
                <NumberFormat
                  className="usd"
                  value={toFiat(amountOut, exitType!)}
                  type="fiat"
                  abbr
                />
              </dd>
            </div>
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
