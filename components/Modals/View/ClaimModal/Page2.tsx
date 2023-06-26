import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { useTransaction } from 'wagmi'
import clsx from 'clsx'

import { claimTxAtom } from 'states/tx'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { useFiat, useModal, useStaking } from 'hooks'

import { StyledClaimModalPage2 } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type ClaimModalPage2Props = {
  rewardList: boolean[]
  earnedTokenRewards: string[]
}

export default function ClaimModalPage2({
  rewardList,
  earnedTokenRewards,
}: ClaimModalPage2Props) {
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { rewardTokenAddresses, tokens } = useStaking()

  const initRewards = rewardList.map((check, i) =>
    check ? earnedTokenRewards[i] : '0'
  )

  const [rewards, setRewards] = useState<string[]>(initRewards)

  const totalClaimFiatValue = rewards
    .reduce(
      (acc, amt, i) => acc.plus(toFiat(amt, rewardTokenAddresses[i])),
      bnum(0)
    )
    .toString()

  const { hash } = useAtomValue(claimTxAtom)

  useTransaction({
    hash,
    suspense: false,
    async onSuccess(tx) {
      const { logs } = await tx.wait()

      const parsedLogs = parseTransferLogs(logs)

      const claimed = rewardList.map((check, i) => {
        if (!check) return '0'
        const addr = rewardTokenAddresses[i]

        return formatUnits(parsedLogs?.[addr], tokens[addr].decimals)
      })

      setRewards(claimed)
    },
  })

  return (
    <StyledClaimModalPage2>
      <header className="modalHeader">
        <h2 className="title">Claim completed!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          <dl className="detailList">
            {rewardList.map((check, i) => {
              if (!check) return null
              const amt = rewards[i]

              const address = rewardTokenAddresses[i]
              const symbol = tokens[address]?.symbol
              const active = !bnum(amt).isZero()

              return (
                <div className="detailItem" key={`claimModal:page2:${address}`}>
                  <dt>
                    <TokenIcon address={address} $size={20} $dark />
                    {symbol}
                  </dt>

                  <dd>
                    <CountUp className={clsx({ active })} value={amt} plus />

                    <NumberFormat
                      className={clsx('usd', { active })}
                      value={toFiat(amt, address)}
                      type="fiat"
                    />
                  </dd>
                </div>
              )
            })}

            <div className="detailItem total">
              <dt>Total claimed</dt>
              <dd>
                <CountUp value={totalClaimFiatValue} type="fiat" />
              </dd>
            </div>
          </dl>

          {rewardList.map((check, i) => {
            if (!check) return null

            const address = rewardTokenAddresses[i]
            const token = tokens[address]

            return (
              <ImportToken
                address={token.address}
                key={`claimModal:page2:importToken:${address}`}
              />
            )
          })}
        </div>
      </div>

      <footer className="modalFooter">
        <Button type="button" onClick={removeModal} $size="md">
          Close
        </Button>
      </footer>
    </StyledClaimModalPage2>
  )
}
