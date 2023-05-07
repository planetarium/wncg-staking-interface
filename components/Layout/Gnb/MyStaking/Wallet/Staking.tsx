import { useAtomValue } from 'jotai'
import { motion } from 'framer-motion'

import { isUnstakeWindowAtom } from 'states/account'
import { ModalType } from 'config/constants'
import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useFiat, useModal, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledWalletStaking } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import Suspense from 'components/Suspense'
import Rewards from './Rewards'

type WalletStakingProps = {
  closeWallet(): void
}

export default function WalletStaking({ closeWallet }: WalletStakingProps) {
  const toFiat = useFiat()
  const { addModal } = useModal()
  const { stakedTokenAddress } = useStaking()

  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const isUnstakeWindow = useAtomValue(isUnstakeWindowAtom)

  const stakedTokenFiatValue = toFiat(stakedTokenBalance, stakedTokenAddress)

  function openCooldown() {
    addModal({
      type: ModalType.Cooldown,
    })
    closeWallet()
  }

  function openRevenue() {
    addModal({
      type: ModalType.Revenue,
    })
    closeWallet()
  }

  const hasStakedToken = bnum(stakedTokenBalance).gt(0)

  return (
    <StyledWalletStaking>
      <header className="header">
        <h3 className="title">My staked LP tokens</h3>
        <div className="amount">
          <CountUp value={stakedTokenBalance} />
          {hasStakedToken && (
            <NumberFormat value={stakedTokenFiatValue} type="fiat" />
          )}
        </div>
      </header>

      {hasStakedToken && (
        <button className="revenueButton" type="button" onClick={openRevenue}>
          <Icon icon="time" />
          <span className="label">Estimated earnings</span>
        </button>
      )}

      <Suspense>
        <Rewards closeWallet={closeWallet} />
      </Suspense>

      {!isUnstakeWindow && (
        <motion.div {...MOTION} variants={fadeIn}>
          <Button
            className="actionButton"
            onClick={openCooldown}
            disabled={!hasStakedToken}
            $size="md"
            $variant="secondary"
          >
            Withdraw
          </Button>
        </motion.div>
      )}
    </StyledWalletStaking>
  )
}
