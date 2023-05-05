import { useState } from 'react'
import { useTransaction } from 'wagmi'
import { useMount } from 'react-use'
import { constants } from 'ethers'
import Link from 'next/link'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import clsx from 'clsx'

import { approveTxAtom } from 'states/tx'
import config from 'config'
import { formatUnits } from 'utils/formatUnits'
import { bnum } from 'utils/bnum'
import { parseLog } from 'utils/parseLog'
import { txUrlFor } from 'utils/txUrlFor'
import { useStaking } from 'hooks'
import { useWatch } from './useWatch'

import { StyledApproveToast } from './styled'
import Icon from 'components/Icon'
import ToastStatus from './Status'
import TokenIcon from 'components/TokenIcon'
import NumberFormat from 'components/NumberFormat'

type ToastProps = {
  hash: Hash
  toastLabel: string
  tokenSymbol: string
  tokenAddress: Hash
  tokenDecimals: number
}

export default function ApproveToast({
  hash,
  toastLabel,
  tokenSymbol,
  tokenAddress,
  tokenDecimals,
}: ToastProps) {
  const [allowance, setAllowance] = useState<string | null>(null)

  const { stakedTokenAddress } = useStaking()

  const setTx = useSetAtom(approveTxAtom)

  const status = useWatch(hash)

  useMount(() => setTx(RESET))

  useTransaction({
    hash,
    chainId: config.chainId,
    enabled: !!hash,
    suspense: false,
    async onSuccess(tx) {
      try {
        const { logs = [] } = (await tx?.wait()) ?? {}
        const approvalLog = logs
          .map((l) => parseLog(l))
          .find((l) => l?.name === 'Approval')

        const _allowance = approvalLog?.args?.value?.toString() ?? '0'
        const newAllowance = formatUnits(_allowance, tokenDecimals)

        if (newAllowance) {
          setAllowance(newAllowance)
        }
      } catch {}
    },
  })

  const hasAllowance = bnum(allowance ?? '0').gt(0)

  const isMaxApproved = bnum(allowance ?? '0').eq(
    formatUnits(constants.MaxUint256.toString(), tokenDecimals)
  )

  return (
    <StyledApproveToast>
      <header className="toastHeader">
        <Link href={txUrlFor(hash)!} target="_blank" rel="noopener">
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
                <TokenIcon
                  address={tokenAddress}
                  dark
                  $size={tokenAddress === stakedTokenAddress ? 16 : 20}
                />
              </div>
              {tokenSymbol}
            </dt>

            {hasAllowance && (
              <dd className={clsx({ text: isMaxApproved })}>
                {isMaxApproved ? (
                  'Infinite approval'
                ) : (
                  <NumberFormat value={allowance!} />
                )}
              </dd>
            )}
          </div>
        </dl>
      </div>
    </StyledApproveToast>
  )
}
