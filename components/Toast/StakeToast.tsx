import Link from 'next/link'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { stakeTxAtom } from 'states/tx'
import { txUrlFor } from 'utils/txUrlFor'
import { useChain, useClientMount, useFiat, useStaking } from 'hooks'
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
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { lpToken } = useStaking()

  const setTx = useSetAtom(stakeTxAtom)

  const fiatValue = toFiat(stakeAmount!, lpToken?.address)

  const status = useWatch(hash)

  useClientMount(() => setTx(RESET))

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(chainId, hash)!} target="_blank" rel="noopener">
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
              <TokenIcon address={lpToken?.address} $size={20} />
              {lpToken?.name}
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
        <ImportToken address={lpToken?.address} $size="sm" $variant="primary" />
      </footer>
    </StyledToast>
  )
}
