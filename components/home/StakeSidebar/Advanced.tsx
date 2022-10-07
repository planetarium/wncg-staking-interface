import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { useNetwork } from 'wagmi'
import { AnimatePresence, motion } from 'framer-motion'
import styles from '../styles/StakeSidebar.module.scss'

import { legacyModeAtom } from 'states/userSettings'
import { isMobileAtom } from 'states/ui'
import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { configService } from 'services/config'
import { gaEvent } from 'lib/gtag'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { parseTxError } from 'utils/tx'
import {
  useAccount,
  useConnectWallets,
  useEarmark,
  useFiatCurrency,
  useToast,
} from 'hooks'
import { useClaimableTokens, useStaking } from 'hooks/contracts'
import { motionVariants } from '../constants'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { Icon } from 'components/Icon'

export function StakeSidebarAdvanced() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { isConnected } = useAccount()
  const { claimableTokens } = useClaimableTokens()
  const { connect } = useConnectWallets()
  const { earmarkRewards } = useEarmark()
  const { toFiat } = useFiatCurrency()
  const { chain } = useNetwork()
  const { earmarkIncentivePcnt: pcnt } = useStaking()
  const { addToast } = useToast()

  const isMobile = useAtomValue(isMobileAtom)
  const legacyMode = useAtomValue(legacyModeAtom)

  const earmarkIncentive = bnum(claimableTokens).times(pcnt).toNumber() ?? 0

  const earmarkIncentiveInFiatValue = toFiat(
    configService.bal,
    earmarkIncentive
  )

  const networkMismatch = chain && chain.id !== networkChainId
  const disabled = networkMismatch || loading

  function toggle() {
    if (!open) {
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
        addToast({
          ...errorMsg,
          type: 'error',
        })
      }
    }
  }

  // FIXME: Handle event in different PR
  // const earmarkRewardsHandler = useCallback(() => {
  //   setLoading(false)
  // }, [])

  // // NOTE: Earmark rewards event
  // useEffect(() => {
  //   if (earmarkRewardsEvent) {
  //     provider?.on(earmarkRewardsEvent, earmarkRewardsHandler)
  //     return () => {
  //       provider?.off(earmarkRewardsEvent)
  //     }
  //   }
  // }, [earmarkRewardsEvent, earmarkRewardsHandler, provider])

  if (legacyMode) return null

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
