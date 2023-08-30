import { useState } from 'react'
import Link from 'next/link'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useTransaction } from 'wagmi'

import { claimTxAtom } from 'states/tx'
import { formatUnits } from 'utils/formatUnits'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { txUrlFor } from 'utils/txUrlFor'
import {
  useClientMount,
  useChain,
  useFiat,
  useStaking,
  useViemClients,
} from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'

type ClaimToastProps = Required<ClaimTx>

export default function ClaimToast({
  earnedTokenRewards,
  hash,
  rewardList,
}: ClaimToastProps) {
  const { publicClient } = useViemClients()
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { rewardTokenAddresses, tokens } = useStaking()

  const setTx = useSetAtom(claimTxAtom)

  const claimedRewards = rewardList.map((check, i) =>
    check ? earnedTokenRewards[i] : '0'
  )

  const [amounts, setAmounts] = useState(claimedRewards)

  const status = useWatch(hash)

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
        const actualClaimedRewards = rewardTokenAddresses.map(
          (addr) =>
            formatUnits(parsedLogs?.[addr] ?? '0', tokens[addr].decimals) ?? '0'
        )

        if (logs.length > 0) {
          setAmounts(actualClaimedRewards)
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
            Claim rewards
            <Icon icon="outlink" />
          </h3>

          <Status status={status} />
        </Link>
      </header>

      <div className="toastContent">
        <dl className="detailList">
          {rewardList.map((check, i) => {
            if (!check) return null
            const amt = amounts[i]

            const address = rewardTokenAddresses[i]
            const symbol = tokens[address]?.symbol ?? ''
            const fiatValue = toFiat(amt, address)

            return (
              <div className="detailItem" key={`claimToast:rewards:${address}`}>
                <dt>
                  <TokenIcon address={address} $dark $size={20} />
                  {symbol}
                </dt>

                <dd>
                  <NumberFormat value={amt} />
                  <NumberFormat className="usd" value={fiatValue} type="fiat" />
                </dd>
              </div>
            )
          })}
        </dl>
      </div>

      <footer className="toastFooter">
        {rewardList.map((check, i) => {
          if (!check) return null

          const address = rewardTokenAddresses[i]

          return (
            <ImportToken
              className="importButton"
              address={address}
              key={`claimToast:importToken:${address}`}
              $size="sm"
              $variant="primary"
            />
          )
        })}
      </footer>
    </StyledToast>
  )
}
