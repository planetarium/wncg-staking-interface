import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import Link from 'next/link'

import { useChain, useClientMount, useStaking } from 'hooks'
import { exitTxAtom } from 'states/tx'
import { txUrlFor } from 'utils/txUrlFor'
import { useWatch } from './useWatch'

import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'
import { StyledToast } from './styled'

type ExitToast = Required<ExitTx>

export default function ExitToast({ hash, totalExitFiatValue }: ExitToast) {
  const { chainId } = useChain()
  const { lpToken } = useStaking()

  const setTx = useSetAtom(exitTxAtom)

  const status = useWatch(hash)

  const importTokenAddress = lpToken?.address

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
          <div className="detailItem">
            <dt>
              <div className="token">
                <TokenIcon address={lpToken?.address} $size={20} />
              </div>
              {lpToken?.name}
            </dt>

            <dd>
              <NumberFormat
                className="usd"
                value={totalExitFiatValue}
                type="fiat"
                abbr
              />
            </dd>
          </div>
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
