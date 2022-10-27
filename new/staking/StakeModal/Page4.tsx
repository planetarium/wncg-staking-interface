import { memo } from 'react'
import type { StateValue } from 'xstate'
import { AnimatePresence, motion } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { usdCountUpOption } from 'constants/countUp'
import { fadeIn } from 'constants/motionVariants'
import { useModal, useStakedBalance } from 'hooks'

import { StyledStakeModalPage4 } from './styled'
import Button from 'new/Button'
import CountUp from 'new/CountUp'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type StakeModalPage4Props = {
  amount: string
  currentPage: number
  currentState: StateValue
  fiatValue: number
}

function StakeModalPage4({
  amount,
  currentPage,
  currentState,
  fiatValue,
}: StakeModalPage4Props) {
  const { removeModal } = useModal()
  const { stakedBalanceInFiatValue } = useStakedBalance()

  const success = currentState === 'stakeSuccess'
  const fail = currentState === 'stakeFail'

  function close() {
    removeModal(ModalCategory.Stake)
  }

  return (
    <AnimatePresence>
      {currentPage === 4 && (
        <StyledStakeModalPage4
          as={motion.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
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
                <NumberFormat value={amount} prefix="+ " />

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

            <div className="detailItem total">
              <dt>My staked</dt>
              <dd>
                <strong className="usd">
                  <SvgIcon icon="approximate" />
                  <CountUp
                    {...usdCountUpOption}
                    end={stakedBalanceInFiatValue}
                    prefix="✨ $"
                  />
                </strong>
              </dd>
            </div>
          </dl>

          <Button onClick={close} $size="lg">
            Go to main
          </Button>
        </StyledStakeModalPage4>
      )}
    </AnimatePresence>
  )
}

export default memo(StakeModalPage4)
