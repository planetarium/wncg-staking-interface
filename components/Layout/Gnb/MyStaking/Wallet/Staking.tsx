import { useAtomValue } from 'jotai'
import { motion } from 'framer-motion'

import { isUnstakeWindowAtom } from 'states/account'
import { ModalType } from 'config/constants'
import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useChain, useFiat, useModal, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledWalletStaking } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import Suspense from 'components/Suspense'
import BonusRewards from './BonusRewards'
import SingleRewards from './SingleRewards'
import { isEthereum } from 'utils/isEthereum'

type WalletStakingProps = {
  closeWallet(): void
}

export default function WalletStaking({ closeWallet }: WalletStakingProps) {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { addModal } = useModal()
  const { lpToken, rewardTokenAddresses } = useStaking()

  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const isUnstakeWindow = useAtomValue(isUnstakeWindowAtom)

  const stakedTokenFiatValue = toFiat(stakedTokenBalance, lpToken.address)

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
  const hasBonusRewards = rewardTokenAddresses.length > 1

  return (
    <StyledWalletStaking>
      <header className="header">
        <h3 className="title">
          My staked {isEthereum(chainId) ? 'LP tokens' : 'Cake-LP'}
        </h3>
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
        {hasBonusRewards ? (
          <BonusRewards closeWallet={closeWallet} />
        ) : (
          <SingleRewards closeWallet={closeWallet} />
        )}
      </Suspense>

      {!isUnstakeWindow && (
        <motion.div {...MOTION} variants={ANIMATION_MAP.fadeIn}>
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
