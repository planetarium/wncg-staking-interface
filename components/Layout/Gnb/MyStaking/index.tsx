import { MouseEvent } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

import { cooldownWindowAtom, withdrawWindowAtom } from 'states/account'
import { showMyStakingAtom } from 'states/ui'
import { EXIT_MOTION } from 'config/motions'
import { fadeIn, popIn } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useFiat, useIsMounted, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledGnbMyStaking } from './styled'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import Lottie from 'components/Lottie'
import Suspense from 'components/Suspense'
import Wallet from './Wallet'

export default function GnbMyStaking() {
  const [show, setShow] = useAtom(showMyStakingAtom)

  const toFiat = useFiat()
  const isMounted = useIsMounted()
  const { stakedTokenAddress } = useStaking()

  const { stakedTokenBalance = '0' } =
    useFetchUserData({ enabled: isMounted }).data ?? {}
  const stakedTokenBalanceInFiatValue = toFiat(
    stakedTokenBalance,
    stakedTokenAddress
  )

  console.log(stakedTokenBalance)

  const cooldownWindow = useAtomValue(cooldownWindowAtom)
  const unstakeWindow = useAtomValue(withdrawWindowAtom)

  const showUnstakeBadge = unstakeWindow && !show

  function toggle(e: MouseEvent) {
    e.stopPropagation()
    setShow((prev) => !prev)
  }

  function closeMenu() {
    setShow(false)
  }

  const hasStakedToken = bnum(stakedTokenBalance).gt(0)

  return (
    <StyledGnbMyStaking>
      <motion.button
        className={clsx('stakingButton', { tooltipGroup: unstakeWindow })}
        type="button"
        onClick={toggle}
        variants={fadeIn}
      >
        <Icon icon="coin" $size={24} />
        My LP
        <CountUp
          value={stakedTokenBalanceInFiatValue}
          type={hasStakedToken ? 'fiat' : undefined}
          colon
          abbr
        />
        <AnimatePresence>
          {cooldownWindow && (
            <motion.div
              {...EXIT_MOTION}
              className="cooldownBadge"
              variants={popIn}
              transition={{ duration: 0.05, type: 'spring' }}
            >
              <Lottie animationData="timer" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showUnstakeBadge && (
            <motion.div
              {...EXIT_MOTION}
              className="unstakeBadge"
              variants={fadeIn}
              role="presentation"
            />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {show && (
          <Suspense>
            <Wallet closeWallet={closeMenu} />
          </Suspense>
        )}
      </AnimatePresence>
    </StyledGnbMyStaking>
  )
}
