import { memo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTransaction } from 'wagmi'
import { motion } from 'framer-motion'

import { joinTxAtom } from 'states/tx'
import { showPoolAtom } from 'states/ui'
import config from 'config'
import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { parseTransferLogs } from 'utils/parseTransferLogs'

import { useFiat, useModal, useStaking } from 'hooks'

import { StyledJoinModalPage2 } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Lottie from 'components/Lottie'
import NumberFormat from 'components/NumberFormat'

function JoinModalPage2() {
  const [amount, setAmount] = useState<string | null>(null)

  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { stakedTokenAddress, tokenMap } = useStaking()
  const stakedToken = tokenMap[stakedTokenAddress]

  const { hash, bptBalance: lpTokenBalance = '0' } = useAtomValue(joinTxAtom)
  const setShowPool = useSetAtom(showPoolAtom)

  const amountInFiatValue = toFiat(amount ?? 0, stakedTokenAddress)
  const hadBalanceBefore = bnum(lpTokenBalance).gt(0)
  const lpTokenBalanceInFiatValue = toFiat(lpTokenBalance, stakedTokenAddress)

  const totalLpTokenBalance = bnum(amount ?? 0)
    .plus(lpTokenBalance)
    .toString()
  const totalLpTokenBalanceInFiatValue = toFiat(
    totalLpTokenBalance,
    stakedTokenAddress
  )

  function closeModal() {
    removeModal()
  }

  async function goStake() {
    setShowPool(false)
    removeModal()
  }

  useTransaction({
    chainId: config.chainId,
    hash,
    enabled: !!hash,
    async onSuccess(tx) {
      const { logs } = await tx.wait()

      const parsedLogs = parseTransferLogs(logs)
      const claimed = parsedLogs?.[stakedTokenAddress]

      if (claimed) {
        setAmount(formatUnits(claimed, stakedToken.decimals))
      }
    },
  })

  return (
    <StyledJoinModalPage2>
      <header className="modalHeader">
        <Lottie className="confetti" animationData="success" />

        <h2 className="title">Join pool completed!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          <dl className="detailList">
            {hadBalanceBefore && (
              <div className="detailItem">
                <dt>Already had</dt>
                <dd>
                  <NumberFormat value={lpTokenBalance} decimals={8} />

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
                variants={fadeIn}
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
