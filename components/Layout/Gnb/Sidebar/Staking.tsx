import { MouseEvent, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'

import { isUnstakeWindowAtom } from 'states/account'

import { ModalType } from 'config/constants'
import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useBalances, useFiat, useModal, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledSidebarStaking } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import UnstakeWindow from './UnstakeWindow'

type SidebarStakingProps = {
  closeSidebar(e: MouseEvent): void
}

export default function SidebarStaking({ closeSidebar }: SidebarStakingProps) {
  const [show, setShow] = useState(false)

  const balanceOf = useBalances()
  const toFiat = useFiat()
  const { addModal } = useModal()
  const { stakedTokenAddress } = useStaking()

  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const isUnstakeWindow = useAtomValue(isUnstakeWindowAtom)

  const stakedTokenFiatValue = toFiat(stakedTokenBalance, stakedTokenAddress)

  const bptBalance = balanceOf(stakedTokenAddress)
  const bptBalanceInFiatValue = toFiat(bptBalance, stakedTokenAddress)

  const hasLpToken = bnum(bptBalance).gt(0)
  const hasStakedToken = bnum(stakedTokenBalance).gt(0)
  const exitDisabled = !hasLpToken
  const withdrawDisabled = bnum(stakedTokenBalance).isZero()

  function toggle() {
    setShow((prev) => !prev)
  }

  function openCooldown(e: MouseEvent) {
    addModal({
      type: ModalType.Cooldown,
    })
    closeSidebar(e)
  }

  function openRevenue(e: MouseEvent) {
    addModal({
      type: ModalType.Revenue,
    })
    closeSidebar(e)
  }

  function openExitModal(e: MouseEvent) {
    addModal({
      type: ModalType.Exit,
    })
    closeSidebar(e)
  }

  return (
    <StyledSidebarStaking $expanded={show} $unstakeWindow={isUnstakeWindow}>
      <header className="header">
        <h3 className="title">My staked LP tokens</h3>

        <button className="toggleButton" type="button" onClick={toggle}>
          <CountUp value={stakedTokenBalance} />
          <Icon icon={show ? 'chevronDown' : 'chevronRight'} $size={24} />
        </button>
      </header>

      <AnimatePresence>
        {show && (
          <motion.div
            className="content"
            {...EXIT_MOTION}
            variants={slideInDown}
          >
            <dl className="detailList">
              <div className="detailItem">
                <dt>My staked LP</dt>
                <dd className="amount">
                  <CountUp value={stakedTokenBalance} />
                  <NumberFormat
                    value={stakedTokenFiatValue}
                    type="fiat"
                    prefix="$"
                  />
                  {hasStakedToken && (
                    <button
                      className="revenueButton"
                      type="button"
                      onClick={openRevenue}
                    >
                      <Icon icon="time" />
                      <span className="label">Estimated earnings</span>
                    </button>
                  )}
                </dd>

                <dd>
                  <AnimatePresence>
                    {isUnstakeWindow && (
                      <UnstakeWindow closeSidebar={closeSidebar} />
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {!isUnstakeWindow && (
                      <Button
                        onClick={openCooldown}
                        disabled={withdrawDisabled}
                        $variant="secondary"
                        $size="md"
                      >
                        Withdraw
                      </Button>
                    )}
                  </AnimatePresence>
                </dd>
              </div>

              <div className="detailItem">
                <dt>Stakable LP</dt>
                <dd className="amount">
                  <CountUp value={bptBalance} />
                  <NumberFormat
                    value={bptBalanceInFiatValue}
                    type="fiat"
                    prefix="$"
                  />
                </dd>
                <dd>
                  <Button
                    onClick={openExitModal}
                    $variant="secondary"
                    $size="md"
                    disabled={exitDisabled}
                  >
                    Exit pool
                  </Button>
                </dd>
              </div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </StyledSidebarStaking>
  )
}
