import { memo, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { usdCountUpOption } from 'constants/countUp'
import { bnum } from 'utils/num'
import { getTokenSymbol } from 'utils/token'
import { useFiatCurrency, useModal } from 'hooks'

import { ModalCompletePage } from 'new/Modals/shared'
import Button from 'new/Button'
import CountUp from 'new/CountUp'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type ClaimRewardModalPage2Props = {
  currentPage: number
  result: Record<string, string>
}

function ClaimRewardModalPage2({
  currentPage,
  result,
}: ClaimRewardModalPage2Props) {
  const { toFiat } = useFiatCurrency()
  const { removeModal } = useModal()

  const rewardedAmounts = Object.entries(result)

  const totalRewardedAmountsInFiatValue = useMemo(
    () =>
      rewardedAmounts
        .reduce(
          (total, [address, reward]) => total.plus(toFiat(address, reward)),
          bnum(0)
        )
        .toString(),
    [rewardedAmounts, toFiat]
  )

  function close() {
    removeModal(ModalCategory.ClaimReward)
  }

  return (
    <AnimatePresence>
      {currentPage === 2 && (
        <ModalCompletePage>
          <header className="modalHeader">
            <h2 className="title">Claim completed!</h2>
          </header>

          <dl className="details">
            {rewardedAmounts.map(([address, reward], i) => {
              const symbol = getTokenSymbol(address)
              const fiatValue = toFiat(address, reward)

              return (
                <div className="detailItem" key={`claimedRewards:${address}`}>
                  <dt>{symbol}</dt>
                  <dd>
                    <NumberFormat
                      value={reward}
                      prefix="+ "
                      decimalScale={18}
                    />

                    <span className="usd">
                      <SvgIcon icon="approximate" $size={16} />
                      <NumberFormat
                        value={fiatValue}
                        decimals={2}
                        prefix="($"
                        suffix=")"
                      />
                    </span>
                  </dd>
                </div>
              )
            })}

            <div className="detailItem total">
              <dt>You earned</dt>
              <dd>
                <strong className="usd">
                  <SvgIcon icon="approximate" />
                  <CountUp
                    {...usdCountUpOption}
                    end={totalRewardedAmountsInFiatValue}
                    prefix="✨ $"
                  />
                </strong>
              </dd>
            </div>
          </dl>

          <div className="buttonGroup">
            <Button onClick={close} $size="lg">
              Go to main
            </Button>
          </div>
        </ModalCompletePage>
      )}
    </AnimatePresence>
  )
}

export default memo(ClaimRewardModalPage2)
