import { memo, useMemo } from 'react'
import type { StateValue } from 'xstate'
import { AnimatePresence } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { usdCountUpOption } from 'constants/countUp'
import { bnum } from 'utils/num'
import { getTokenSymbol } from 'utils/token'
import { useFiatCurrency, useModal } from 'hooks'
import { useStaking } from 'hooks/contracts'

import { ModalCompletePage } from 'new/Modals/shared'
import Button from 'new/Button'
import CountUp from 'new/CountUp'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type ExitModalPage2Props = {
  currentPage: number
  currentState: StateValue
  result: Record<string, string>
}

function ExitModalPage2({
  currentPage,
  currentState,
  result,
}: ExitModalPage2Props) {
  const { toFiat } = useFiatCurrency()
  const { removeModal } = useModal()
  const { stakedTokenAddress } = useStaking()

  const exitedAmounts = Object.entries(result).filter(
    ([address]) => address !== stakedTokenAddress
  )

  const totalExitedAmountsInFiatValue = useMemo(
    () =>
      exitedAmounts
        .reduce(
          (total, [address, amount]) => total.plus(toFiat(address, amount)),
          bnum(0)
        )
        .toString(),
    [exitedAmounts, toFiat]
  )

  // FIXME: Handle failed tx
  const success = currentState === 'stakeSuccess'
  const fail = currentState === 'stakeFail'

  function close() {
    removeModal(ModalCategory.Exit)
  }

  return (
    <AnimatePresence>
      {currentPage === 2 && (
        <ModalCompletePage>
          <header className="modalHeader">
            <h2 className="title">Exit pool completed!</h2>
          </header>

          <dl className="details">
            {exitedAmounts.map(([address, amount]) => {
              const symbol = getTokenSymbol(address)
              const fiatValue = toFiat(address, amount)

              return (
                <div className="detailItem" key={`exitedAmounts:${address}`}>
                  <dt>{symbol}</dt>
                  <dd>
                    <NumberFormat
                      value={amount}
                      prefix="+ "
                      decimalScale={18}
                    />

                    <span className="usd">
                      <SvgIcon icon="approximate" />
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
              <dt>You received</dt>
              <dd>
                <strong className="usd">
                  <SvgIcon icon="approximate" $size={24} />
                  <CountUp
                    {...usdCountUpOption}
                    end={totalExitedAmountsInFiatValue}
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

export default memo(ExitModalPage2)
