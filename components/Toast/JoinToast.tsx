import Link from 'next/link'
import { useMount } from 'react-use'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { joinTxAtom } from 'states/tx'
import { txUrlFor } from 'utils/txUrlFor'
import { useChain, useFiat, useStaking } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'

type JoinToastProps = {
  hash: Hash
  joinAmounts: string[]
}

export default function JoinToast({ hash, joinAmounts }: JoinToastProps) {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { lpToken, poolTokens } = useStaking()

  const setTx = useSetAtom(joinTxAtom)

  const status = useWatch(hash)

  useMount(() => setTx(RESET))

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
        <dl className="detailList">
          {joinAmounts.map((amt, i) => {
            const token = poolTokens[i]
            const fiatValue = toFiat(amt, token.address)
            const { address, symbol } = token

            return (
              <div className="detailItem" key={`joinToast:${address}:${amt}`}>
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
        <ImportToken address={lpToken.address} $size="sm" $variant="primary" />
      </footer>
    </StyledToast>
  )
}
