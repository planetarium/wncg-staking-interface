import { memo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTransaction } from 'wagmi'
import { motion } from 'framer-motion'

import { addLiquidityTxAtom } from 'states/tx'
import { showPoolAtom } from 'states/ui'
import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { parseTransferLogs } from 'utils/parseTransferLogs'

import { useChain, useFiat, useModal, useStaking } from 'hooks'

import { StyledAddLiquidityModalPage2 } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Lottie from 'components/Lottie'
import NumberFormat from 'components/NumberFormat'

function AddLiquidityModalPage2() {
  const [amount, setAmount] = useState<string | null>(null)

  const { chainId } = useChain()
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { lpToken } = useStaking()

  const { hash, userLpAmount = '0' } = useAtomValue(addLiquidityTxAtom)
  const setShowPool = useSetAtom(showPoolAtom)

  const amountInFiatValue = toFiat(amount ?? 0, lpToken.address)
  const hadLpBalanceBefore = bnum(userLpAmount).gt(0)
  const lpTokenBalanceInFiatValue = toFiat(userLpAmount, lpToken.address)

  const totalUserLpAmount = bnum(amount ?? 0)
    .plus(userLpAmount)
    .toString()
  const totalUserLpAmountFiatValue = toFiat(totalUserLpAmount, lpToken.address)

  function closeModal() {
    removeModal()
  }

  async function goStake() {
    setShowPool(false)
    removeModal()
  }

  useTransaction({
    chainId,
    hash,
    enabled: !!hash,
    async onSuccess(tx) {
      const { logs } = await tx.wait()

      const parsedLogs = parseTransferLogs(logs)
      const claimed = parsedLogs?.[lpToken.address]

      if (claimed) {
        setAmount(formatUnits(claimed, lpToken.decimals))
      }
    },
  })

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

            {amount && (
              <motion.div
                {...MOTION}
                className="detailItem accent"
                variants={ANIMATION_MAP.fadeIn}
              >
                <dt>Received LP tokens</dt>

                <dd>
                  <NumberFormat value={amount} plus decimals={8} />
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
                <CountUp value={totalUserLpAmount} decimals={8} />
                <strong className="fiatValue">
                  <NumberFormat
                    value={totalUserLpAmountFiatValue}
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
