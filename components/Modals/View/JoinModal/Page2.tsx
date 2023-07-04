import { memo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { motion } from 'framer-motion'

import { joinTxAtom } from 'states/tx'
import { showPoolAtom } from 'states/ui'
import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { receivedLpAmountAtom } from './useWatch'

import { useFiat, useModal, useStaking, useViemClient } from 'hooks'

import { StyledJoinModalPage2 } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Lottie from 'components/Lottie'
import NumberFormat from 'components/NumberFormat'

function JoinModalPage2() {
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { lpToken } = useStaking()

  const { lpBalance = '0' } = useAtomValue(joinTxAtom)
  const receivedLpAmount = useAtomValue(receivedLpAmountAtom)
  const setShowPool = useSetAtom(showPoolAtom)

  const amountInFiatValue = toFiat(receivedLpAmount ?? 0, lpToken.address)
  const hadLpBalanceBefore = bnum(lpBalance).gt(0)
  const lpTokenBalanceInFiatValue = toFiat(lpBalance, lpToken.address)

  const totalLpTokenBalance = bnum(receivedLpAmount ?? 0)
    .plus(lpBalance)
    .toString()
  const totalLpTokenBalanceInFiatValue = toFiat(
    totalLpTokenBalance,
    lpToken.address
  )

  function closeModal() {
    removeModal()
  }

  async function goStake() {
    setShowPool(false)
    removeModal()
  }

  return (
    <StyledJoinModalPage2>
      <header className="modalHeader">
        <Lottie className="confetti" animationData="success" />

        <h2 className="title">Join pool completed!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          <dl className="detailList">
            {hadLpBalanceBefore && (
              <div className="detailItem">
                <dt>Already had</dt>
                <dd>
                  <NumberFormat value={lpBalance} decimals={8} />

                  <span className="fiatValue">
                    <NumberFormat
                      value={lpTokenBalanceInFiatValue}
                      type="fiat"
                      prefix="$"
                    />
                  </span>
                </dd>
              </div>
            )}

            {receivedLpAmount && (
              <motion.div
                {...MOTION}
                className="detailItem accent"
                variants={ANIMATION_MAP.fadeIn}
              >
                <dt>Received LP tokens</dt>

                <dd>
                  <NumberFormat value={receivedLpAmount} plus decimals={8} />
                  <span className="fiatValue">
                    <NumberFormat
                      value={amountInFiatValue}
                      type="fiat"
                      prefix="$"
                    />
                  </span>
                </dd>
              </motion.div>
            )}

            <div className="detailItem total">
              <dt>My Total LP tokens</dt>
              <dd>
                <CountUp value={totalLpTokenBalance} decimals={8} />
                <strong className="fiatValue">
                  <NumberFormat
                    value={totalLpTokenBalanceInFiatValue}
                    type="fiat"
                    prefix="$"
                  />
                </strong>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="modalFooter">
        <Button onClick={goStake} $size="md">
          Go to stake
        </Button>
        <Button onClick={closeModal} $size="md" $variant="tertiary">
          Close
        </Button>
      </footer>
    </StyledJoinModalPage2>
  )
}

export default memo(JoinModalPage2)
