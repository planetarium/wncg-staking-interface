import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import styles from '../styles/StakeSidebar.module.scss'

import { getIsConnected } from 'app/states/connection'
import { getIsMobile } from 'app/states/mediaQuery'
import { networkMismatchState } from 'app/states/network'
import { getEarmarkIncentive } from 'app/states/reward'
import { TransactionAction } from 'app/states/transaction'
import { gaEvent } from 'lib/gtag'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { handleError } from 'utils/error'
import {
  useAppSelector,
  useEventFilter,
  useProvider,
  useReward,
  useUsd,
} from 'hooks'
import { motionVariants } from '../constants'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { Icon } from 'components/Icon'

export function StakeSidebarAdvanced() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { earmarkEventFilter } = useEventFilter()
  const provider = useProvider()
  const { earmarkIncentive, earmarkRewards } = useReward()
  const { calculateUsdValue } = useUsd()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const incentive = useAppSelector(getEarmarkIncentive)
  const isConnected = useAppSelector(getIsConnected)
  const isMobile = useAppSelector(getIsMobile)

  const disabled = networkMismatch || !isConnected || loading

  function toggle() {
    if (!open) {
      earmarkIncentive()
      gaEvent({
        name: 'open_advanced',
      })
    }
    setOpen((prev) => !prev)
  }

  async function handleHarvest() {
    setLoading(true)
    gaEvent({
      name: 'earmark_rewards',
    })
    try {
      await earmarkRewards()
    } catch (error) {
      setLoading(false)
      handleError(error, TransactionAction.EarmarkRewards)
    }
  }

  const resetLoading = useCallback(() => {
    setLoading(false)
  }, [])

  // NOTE: Earmark rewards event
  useEffect(() => {
    if (earmarkEventFilter) {
      provider?.on(earmarkEventFilter, resetLoading)
      return () => {
        provider?.off(earmarkEventFilter)
      }
    }
  }, [earmarkEventFilter, provider, resetLoading])

  return (
    <div className={styles.advanced}>
      <button
        className={styles.toggleButton}
        type="button"
        onClick={toggle}
        aria-label={open ? 'Close advanced' : 'Open advanced'}
      >
        {open ? '▲' : '▼'} Advanced
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.content}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={motionVariants}
          >
            <header className={styles.header}>
              <h1 className={styles.title}>Harvest BAL reward</h1>
              {!isMobile && (
                <div className={styles.tooltip}>
                  <Icon id="info" />
                  <strong>
                    Platform operation fee 19% and caller incentive 1% are
                    deducted when the reward is harvested. Figures for BAL APR
                    and earned BAL are already after fees.
                  </strong>
                </div>
              )}
            </header>

            <p className={styles.desc}>
              The caller harvests BAL reward from Balancer, and put it into the
              reward contract to be distributed. Caller gets 1% of the harvest
              as a reward.
            </p>

            <dl className={styles.detail}>
              <div className={styles.detailItem}>
                <dt>Caller gets</dt>
                <dd>
                  <div className={styles.bal}>
                    <span className={styles.token}>
                      <Icon id="balancer" />
                    </span>
                    <CountUp
                      {...countUpOption}
                      end={parseFloat(incentive)}
                      decimals={8}
                      duration={0.5}
                    />
                  </div>
                  <CountUp
                    {...usdCountUpOption}
                    className={styles.usd}
                    end={calculateUsdValue('bal', incentive)}
                    isApproximate
                  />
                </dd>
              </div>
            </dl>

            <Button
              onClick={handleHarvest}
              loading={loading}
              disabled={disabled}
              fullWidth
            >
              Harvest BAL
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
