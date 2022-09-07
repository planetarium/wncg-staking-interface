import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import styles from '../styles/StakeSidebar.module.scss'

import { connectedState } from 'app/states/connection'
import { networkMismatchState } from 'app/states/error'
import { isMobileState } from 'app/states/mediaQuery'
import { gaEvent } from 'lib/gtag'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { parseTxError } from 'utils/error'
import {
  useConnection,
  useEarmark,
  useEarmarkIncentive,
  useEvents,
  useProvider,
  useToast,
} from 'hooks'
import { motionVariants } from '../constants'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { Icon } from 'components/Icon'

export function StakeSidebarAdvanced() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { connect } = useConnection()
  const { earmarkRewards } = useEarmark()
  const {
    earmarkIncentive,
    earmarkIncentiveInFiatValue,
    fetchEarmarkIncentive,
  } = useEarmarkIncentive()
  const { earmarkRewardsEvent } = useEvents()
  const provider = useProvider()
  const { addErrorToast } = useToast()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const isConnected = useRecoilValue(connectedState)
  const isMobile = useRecoilValue(isMobileState)

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
      const errorMsg = parseTxError(error)
      if (errorMsg) {
        addErrorToast({
          ...errorMsg,
        })
      }
    }
  }

  const earmarkRewardsHandler = useCallback(() => {
    setLoading(false)
  }, [])

  // NOTE: Earmark rewards event
  useEffect(() => {
    if (earmarkRewardsEvent) {
      provider?.on(earmarkRewardsEvent, earmarkRewardsHandler)
      return () => {
        provider?.off(earmarkRewardsEvent)
      }
    }
  }, [earmarkRewardsEvent, earmarkRewardsHandler, provider])

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
