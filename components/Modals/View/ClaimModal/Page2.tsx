import { useAtomValue } from 'jotai'
import clsx from 'clsx'

import { bnum } from 'utils/bnum'
import { useFiat, useModal, useStaking } from 'hooks'
import { claimedAmountsAtom } from './useWatch'

import { StyledClaimModalPage2 } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import { claimTxAtom } from 'states/tx'

type ClaimModalPage2Props = {
  rewardList: boolean[]
}

export default function ClaimModalPage2({ rewardList }: ClaimModalPage2Props) {
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { rewardTokenAddresses, tokens } = useStaking()

  const claimedAmounts = useAtomValue(claimedAmountsAtom)

  const claimedAmountsSum = claimedAmounts
    .reduce(
      (acc, amt, i) => acc.plus(toFiat(amt, rewardTokenAddresses[i])),
      bnum(0)
    )
    .toString()

  const { hash } = useAtomValue(claimTxAtom)

  return (
    <StyledClaimModalPage2>
      <header className="modalHeader">
        <h2 className="title">Claim completed!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          <dl className="detailList">
            {rewardList.map((check, i) => {
              const amt = claimedAmounts[i]

              if (!check || bnum(amt).isZero()) return null

              const addr = rewardTokenAddresses[i]
              const symbol = tokens[addr]?.symbol
              const active = !bnum(amt).isZero()

              return (
                <div className="detailItem" key={`claimModal:page2:${addr}`}>
                  <dt>
                    <TokenIcon address={addr} $size={20} $dark />
                    {symbol}
                  </dt>

                  <dd>
                    <CountUp className={clsx({ active })} value={amt} plus />

                    <NumberFormat
                      className={clsx('usd', { active })}
                      value={toFiat(amt, addr)}
                      type="fiat"
                    />
                  </dd>
                </div>
              )
            })}

            <div className="detailItem total">
              <dt>Total claimed</dt>
              <dd>
                <CountUp value={claimedAmountsSum} type="fiat" />
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
