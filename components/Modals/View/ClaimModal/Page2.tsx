import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { useTransaction } from 'wagmi'
import clsx from 'clsx'

import { claimTxAtom } from 'states/tx'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { useFiat, useModal, useRewards, useStaking } from 'hooks'

import { StyledClaimModalPage2 } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type ClaimModalPage2Props = {
  rewardList: boolean[]
  earnedRewards: string[]
  totalClaimFiatValue: string
}

export default function ClaimModalPage2({
  rewardList,
  earnedRewards,
  totalClaimFiatValue,
}: ClaimModalPage2Props) {
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { rewardTokenAddresses, rewardTokenDecimals } = useRewards()
  const { tokenMap } = useStaking()

  const [rewards, setRewards] = useState<string[]>(earnedRewards)

  const { hash } = useAtomValue(claimTxAtom)

  useTransaction({
    hash,
    suspense: false,
    async onSuccess(tx) {
      const { logs } = await tx.wait()

      const parsedLogs = parseTransferLogs(logs)
      const list = rewardTokenAddresses.map((addr) => parsedLogs?.[addr] ?? '0')
      const claimed = list.map((r, i) => formatUnits(r, rewardTokenDecimals[i]))

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
              const amt = earnedRewards[i]

              const address = rewardTokenAddresses[i]
              const { symbol } = tokenMap[address]
              const active = !bnum(amt).isZero()

              return (
                <div className="detailItem" key={`claimModal:page2:${address}`}>
                  <dt>
                    <TokenIcon address={address} $size={20} />
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
              <dt>Earned</dt>
              <dd>
                <CountUp value={totalClaimFiatValue} type="fiat" />
              </dd>
            </div>
          </dl>

          {rewardList.map((check, i) => {
            if (!check) return null

            const address = rewardTokenAddresses[i]
            const token = tokenMap[address]

            return (
              <ImportToken
                {...token}
                key={`claimModal:page2:importToken:${address}`}
                name={undefined}
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
