import { MouseEvent, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { ModalType } from 'config/constants'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useFiat, useModal, useStaking } from 'hooks'
import { useFetchUserRewards } from 'hooks/queries'

import { StyledSidebarRewards } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'

type SidebarRewardsProps = {
  closeSidebar(e: MouseEvent): void
}

export default function SidebarRewards({ closeSidebar }: SidebarRewardsProps) {
  const [show, setShow] = useState(false)

  const toFiat = useFiat()
  const { addModal } = useModal()
  const { rewardTokenAddresses, tokens } = useStaking()

  const { earnedTokenRewards = [] } = useFetchUserRewards().data ?? {}
  const earnedTokenRewardsFiatValue = earnedTokenRewards
    .reduce(
      (acc, amt, i) => acc.plus(toFiat(amt, rewardTokenAddresses[i])),
      bnum(0)
    )
    .toString()

  const hasClaimableRewards = earnedTokenRewards.some((r) => bnum(r).gt(0))

  function toggle() {
    setShow((prev) => !prev)
  }

  function openClaim(e: MouseEvent) {
    addModal({
      type: ModalType.Claim,
    })
    closeSidebar(e)
  }

  return (
    <StyledSidebarRewards $expanded={show}>
      <div className="header">
        <h3 className="title">My rewards</h3>

        <button className="toggleButton" type="button" onClick={toggle}>
          <CountUp value={earnedTokenRewardsFiatValue} type="fiat" prefix="$" />
          <Icon icon={show ? 'chevronDown' : 'chevronRight'} $size={24} />
        </button>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            className="content"
            {...EXIT_MOTION}
            variants={ANIMATION_MAP.slideInDown}
          >
            <dl className="detailList">
              {earnedTokenRewards.map((reward, i) => {
                const address = rewardTokenAddresses[i]
                const symbol = tokens[address]?.symbol
                const fiatValue = toFiat(reward, address)

                return (
                  <div
                    className="detailItem"
                    key={`gnb:sidebar:rewards:${address}`}
                  >
                    <dt>{symbol}</dt>

                    <dd className="amount">
                      <CountUp value={reward} plus />
                      <NumberFormat value={fiatValue} type="fiat" prefix="$" />
                    </dd>
                  </div>
                )
              })}
            </dl>

            <Button
              className="claimButton"
              onClick={openClaim}
              disabled={!hasClaimableRewards}
              $variant="secondary"
              $size="md"
            >
              Claim rewards
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </StyledSidebarRewards>
  )
}
