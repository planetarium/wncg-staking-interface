import Link from 'next/link'
import { useMount } from 'react-use'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { stakeTxAtom } from 'states/tx'
import { txUrlFor } from 'utils/txUrlFor'
import { useFiat, useStaking } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'

type StakeToastProps = {
  hash: Hash
  stakeAmount: string
}

export default function StakeToast({ hash, stakeAmount }: StakeToastProps) {
  const toFiat = useFiat()
  const { stakedTokenAddress, tokenMap } = useStaking()

  const { symbol: stakedTokenSymbol } = tokenMap[stakedTokenAddress]

  const setTx = useSetAtom(stakeTxAtom)

  const fiatValue = toFiat(stakeAmount!, stakedTokenAddress)

  const status = useWatch(hash)

  useMount(() => setTx(RESET))

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Staking
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
              {stakedTokenSymbol}
            </dt>
            <dd>
              <NumberFormat value={stakeAmount} decimals={8} />
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
          $size="sm"
          $variant="primary"
        />
      </footer>
    </StyledToast>
  )
}
