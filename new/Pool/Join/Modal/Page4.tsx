import { memo } from 'react'
import type { StateValue } from 'xstate'
import { AnimatePresence } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { getTokenSymbol } from 'utils/token'
import { useFiatCurrency, useModal } from 'hooks'
import { useStaking } from 'hooks/contracts'

import { StyledJoinModalPage4 } from './styled'
import Button from 'new/Button'
import CountUp from 'new/CountUp'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type JoinModalPage4Props = {
  currentPage: number
  currentState: StateValue
  result: Record<string, string>
}

function JoinModalPage4({
  currentPage,
  currentState,
  result,
}: JoinModalPage4Props) {
  const { toFiat } = useFiatCurrency()
  const { removeModal } = useModal()
  const { stakedTokenAddress } = useStaking()

  const joinedAmounts = Object.entries(result).filter(
    ([address]) => address !== stakedTokenAddress
  )

  const bptEarned = result[stakedTokenAddress] ?? '0'

  // FIXME: Handle failed tx
  const success = currentState === 'stakeSuccess'
  const fail = currentState === 'stakeFail'

  function close() {
    removeModal(ModalCategory.Join)
  }

  return (
    <AnimatePresence>
      {currentPage === 4 && (
        <StyledJoinModalPage4>
          <header className="modalHeader">
            <h2 className="title">Join pool completed!</h2>
          </header>

          <dl className="details">
            {joinedAmounts.map(([address, amount]) => {
              if (address === stakedTokenAddress) return null
              const symbol = getTokenSymbol(address)
              const fiatValue = toFiat(address, amount)

              return (
                <div className="detailItem" key={`joinedAmounts:${address}`}>
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
                  <CountUp
                    end={bptEarned}
                    decimals={8}
                    prefix="✨ "
                    suffix=" LP"
                  />
                </strong>
              </dd>
            </div>
          </dl>

          <div className="buttonGroup">
            <Button onClick={close} $size="lg">
              Go to staking
            </Button>
            <Button onClick={close} $variant="tertiary" $size="lg">
              Close
            </Button>
          </div>
        </StyledJoinModalPage4>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinModalPage4)
