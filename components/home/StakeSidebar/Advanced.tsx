import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import styles from '../styles/StakeSidebar.module.scss'

import { getIsConnected } from 'app/states/connection'
import { getIsMobile } from 'app/states/mediaQuery'
import { networkMismatchState } from 'app/states/network'
import { TransactionAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { handleError } from 'utils/error'
import {
  useAppSelector,
  useConnection,
  useEarmark,
  useEarmarkIncentive,
  useEventFilters,
  useProvider,
} from 'hooks'
import { motionVariants } from '../constants'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { Icon } from 'components/Icon'

export function StakeSidebarAdvanced() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { connect } = useConnection()
  const {
    earmarkIncentive,
    earmarkIncentiveInFiatValue,
    fetchEarmarkIncentive,
  } = useEarmarkIncentive()

  const { earmarkEventFilter } = useEventFilters()
  const provider = useProvider()
  const { earmarkRewards } = useEarmark()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const isConnected = useAppSelector(getIsConnected)
  const isMobile = useAppSelector(getIsMobile)

  const disabled = networkMismatch || loading

  function toggle() {
    if (!open) {
      fetchEarmarkIncentive()
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
                      end={earmarkIncentive}
                      decimals={8}
                      duration={0.5}
                      showAlways
                    />
                  </div>
                  <CountUp
                    {...usdCountUpOption}
                    className={styles.usd}
                    end={earmarkIncentiveInFiatValue}
                    isApproximate
                    showAlways
                  />
                </dd>
              </div>
            </dl>

            {isConnected ? (
              <Button
                onClick={handleHarvest}
                loading={loading}
                disabled={disabled}
                fullWidth
              >
                Harvest BAL
              </Button>
            ) : (
              <Button size="large" onClick={connect} fullWidth>
                Connect
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
