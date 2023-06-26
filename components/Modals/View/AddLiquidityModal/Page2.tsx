import { memo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { motion } from 'framer-motion'

import { addLiquidityTxAtom } from 'states/tx'
import { showPoolAtom } from 'states/ui'
import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'

import { useFiat, useModal, useStaking } from 'hooks'
import { receivedLpAmountAtom } from './useWatch'

import { StyledAddLiquidityModalPage2 } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Lottie from 'components/Lottie'
import NumberFormat from 'components/NumberFormat'

function AddLiquidityModalPage2() {
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { lpToken } = useStaking()

  const { userLpAmount = '0' } = useAtomValue(addLiquidityTxAtom)
  const setShowPool = useSetAtom(showPoolAtom)
  const receivedLpAmount = useAtomValue(receivedLpAmountAtom)

  const receivedLpAmountFiatValue = toFiat(
    receivedLpAmount ?? 0,
    lpToken.address
  )
  const hadLpBalanceBefore = bnum(userLpAmount).gt(0)
  const lpTokenBalanceInFiatValue = toFiat(userLpAmount, lpToken.address)

  const userLpAmountSum = bnum(receivedLpAmount ?? 0)
    .plus(userLpAmount)
    .toString()
  const userLpAmountSumFiatValue = toFiat(userLpAmountSum, lpToken.address)

  function closeModal() {
    removeModal()
  }

  async function goStake() {
    setShowPool(false)
    removeModal()
  }

  return (
    <StyledAddLiquidityModalPage2>
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
                  <NumberFormat value={userLpAmount} decimals={8} />

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

            <motion.div
              {...MOTION}
              className="detailItem accent"
              variants={ANIMATION_MAP.fadeIn}
            >
              <dt>Received Cake-LP</dt>

              <dd>
                <NumberFormat value={receivedLpAmount} plus decimals={8} />
                <span className="fiatValue">
                  <NumberFormat
                    value={receivedLpAmountFiatValue}
                    type="fiat"
                    prefix="$"
                  />
                </span>
              </dd>
            </motion.div>

            <div className="detailItem total">
              <dt>My Total Cake-LP</dt>
              <dd>
                <CountUp value={userLpAmountSum} decimals={8} />
                <strong className="fiatValue">
                  <NumberFormat
                    value={userLpAmountSumFiatValue}
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
    </StyledAddLiquidityModalPage2>
  )
}

export default memo(AddLiquidityModalPage2)
