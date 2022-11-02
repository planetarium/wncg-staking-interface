import { memo } from 'react'
import type { StateValue } from 'xstate'
import { AnimatePresence } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { usdCountUpOption } from 'constants/countUp'
import { useFiatCurrency, useModal, useStakedBalance } from 'hooks'

import { ModalCompletePage } from 'new/Modals/shared'
import Button from 'new/Button'
import CountUp from 'new/CountUp'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type StakeModalPage4Props = {
  currentPage: number
  currentState: StateValue
  result: string
}

function StakeModalPage4({
  currentPage,
  currentState,
  result,
}: StakeModalPage4Props) {
  const { bptToFiat } = useFiatCurrency()
  const { removeModal } = useModal()
  const { stakedBalanceInFiatValue } = useStakedBalance()

  const stakedAmount = result
  const stakedAmountInFiatValue = bptToFiat(stakedAmount)

  const success = currentState === 'stakeSuccess'
  const fail = currentState === 'stakeFail'

  function close() {
    removeModal(ModalCategory.Stake)
  }

  return (
    <AnimatePresence>
      {currentPage === 4 && (
        <ModalCompletePage>
          <header className="modalHeader">
            <h2 className="title">
              Staking {success && 'Completed'}
              {fail && 'Failed'}
            </h2>
          </header>

          <dl className="details">
            <div className="detailItem">
              <dt>
                Staked
                <br />
                LP Tokens
              </dt>
              <dd>
                <NumberFormat value={result} prefix="+ " />

                <span className="usd">
                  <SvgIcon icon="approximate" />
                  <NumberFormat
                    value={stakedAmountInFiatValue}
                    decimals={2}
                    prefix="($"
                    suffix=")"
                  />
                </span>
              </dd>
            </div>

            <div className="detailItem total">
              <dt>My staked</dt>
              <dd>
                <strong className="usd">
                  <SvgIcon icon="approximate" $size={24} />
                  <CountUp
                    {...usdCountUpOption}
                    end={stakedBalanceInFiatValue}
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

export default memo(StakeModalPage4)
