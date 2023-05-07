import { useMount } from 'react-use'
import Link from 'next/link'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { unstakeTxAtom } from 'states/tx'
import { txUrlFor } from 'utils/txUrlFor'
import { useFiat, useStaking } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'

type UnstakeToastProps = {
  hash: Hash
  unstakeAmount: string
}

export default function UnstakeToast({
  hash,
  unstakeAmount,
}: UnstakeToastProps) {
  const toFiat = useFiat()
  const { stakedTokenAddress, tokenMap, bptName } = useStaking()
  const { decimals: stakedTokenDecimals, symbol: stakedTokenSymbol } =
    tokenMap[stakedTokenAddress]

  const setTx = useSetAtom(unstakeTxAtom)

  const fiatValue = toFiat(unstakeAmount, stakedTokenAddress)

  const status = useWatch(hash)

  useMount(() => setTx(RESET))

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Withdraw
            <Icon icon="outlink" />
          </h3>
          <Status status={status} />
        </Link>
      </header>

      <div className="toastContent">
        <dl className="detailList">
          <div className="detailItem">
            <dt>
              <div className="token">
                <TokenIcon address={stakedTokenAddress} $size={20} />
              </div>
              {bptName}
            </dt>
            <dd>
              <NumberFormat value={unstakeAmount} decimals={8} />
              <NumberFormat
                className="usd"
                value={fiatValue}
                type="fiat"
                abbr
              />
            </dd>
          </div>
        </dl>
      </div>

      <footer className="toastFooter">
        <ImportToken
          address={stakedTokenAddress}
          decimals={stakedTokenDecimals}
          name={bptName}
          symbol={stakedTokenSymbol}
          $size="sm"
          $variant="primary"
        />
      </footer>
    </StyledToast>
  )
}
