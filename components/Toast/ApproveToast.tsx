import { useMemo, useState } from 'react'
import { useTransaction } from 'wagmi'
import { useMount } from 'react-use'
import Link from 'next/link'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { approveTxAtom } from 'states/tx'
import { txUrlFor } from 'utils/txUrlFor'
import { isEthereum } from 'utils/isEthereum'
import { parseLog } from 'utils/parseLog'
import { useChain, useStaking, useViemClient } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import TokenIcon from 'components/TokenIcon'
import ToastStatus from './Status'

type ApproveToastProps = {
  hash: Hash
  toastLabel: string
  tokenAddress: Hash
  tokenDecimals: number
}

export default function ApproveToast({
  hash,
  toastLabel,
  tokenAddress,
}: ApproveToastProps) {
  const [pending, setPending] = useState<boolean | null>(null)

  const client = useViemClient()
  const { chainId } = useChain()
  const { lpToken, tokens } = useStaking()

  const setTx = useSetAtom(approveTxAtom)

  const status = useWatch(hash)

  useMount(() => setTx(RESET))

  useTransaction({
    hash,
    chainId,
    enabled: !!hash,
    suspense: false,
    async onSuccess(tx) {
      try {
        const { logs = [] } =
          (await client.waitForTransactionReceipt({ hash: tx.hash })) ?? {}

        const approvalLog = logs
          .map((l) => parseLog(l))
          .find((l) => l?.name === 'Approval')

        const allowance = approvalLog?.args?.value?.toString() ?? '0'

        if (allowance != null) {
          setPending(true)
        }
      } catch {}
    },
  })

  const symbol = useMemo(
    () =>
      tokenAddress === lpToken?.address && isEthereum(chainId)
        ? lpToken?.name
        : tokens[tokenAddress]?.symbol,
    [chainId, lpToken?.address, lpToken?.name, tokenAddress, tokens]
  )

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(chainId, hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Approve to {toastLabel}
            <Icon icon="outlink" />
          </h3>
          <ToastStatus status={status} />
        </Link>
      </header>

      <div className="toastContent">
        <dl className="detailList">
          <div className="detailItem">
            <dt>
              <div className="token">
                <TokenIcon address={tokenAddress} $dark $size={20} />
              </div>
              {symbol}
            </dt>

            <dd className="text">
              {pending === null
                ? 'Pending...'
                : pending
                ? 'Confirmed'
                : 'Failed'}
            </dd>
          </div>
        </dl>
      </div>
    </StyledToast>
  )
}
