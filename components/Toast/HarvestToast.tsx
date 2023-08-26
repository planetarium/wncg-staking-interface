import { useState } from 'react'
import Link from 'next/link'
import { RESET } from 'jotai/utils'
import { useTransaction } from 'wagmi'
import { useSetAtom } from 'jotai'

import { harvestTxAtom } from 'states/tx'
import { BAL_ADDRESS } from 'config/constants/addresses'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { txUrlFor } from 'utils/txUrlFor'
import { useClientMount, useChain, useViemClients } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'

type HarvestToastProps = Required<HarvestTx>

export default function HarvestToast({ hash }: HarvestToastProps) {
  const [confirmed, setConfirmed] = useState(false)
  const { balAddress, chainId } = useChain()

  const { publicClient } = useViemClients()
  const bal = BAL_ADDRESS[chainId] as Hash

  const status = useWatch(hash)

  const setTx = useSetAtom(harvestTxAtom)

  useTransaction({
    hash,
    chainId,
    enabled: !!hash,
    suspense: false,
    async onSuccess(tx) {
      try {
        const { logs = [] } =
          (await publicClient.waitForTransactionReceipt({ hash: tx.hash })) ??
          {}

        const parsedLogs = parseTransferLogs(logs)
        const actualHarvestedAmount = parsedLogs?.[balAddress!]

        if (actualHarvestedAmount) {
          setConfirmed(true)
        }
      } catch {}
    },
  })

  useClientMount(() => setTx(RESET))

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(chainId, hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Harvest
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
                <TokenIcon address={balAddress!} $dark $size={20} />
              </div>
              BAL
            </dt>

            <dd className="text">
              {confirmed ? 'Confirmed' : 'Harvesting...'}
            </dd>
          </div>
        </dl>
      </div>

      <footer className="toastFooter">
        <ImportToken address={balAddress!} $size="sm" $variant="primary" />
      </footer>
    </StyledToast>
  )
}
