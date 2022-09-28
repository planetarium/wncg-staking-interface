/* eslint-disable react/jsx-no-target-blank */
import { useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useRecoilValue } from 'recoil'
import { useAccount, useNetwork } from 'wagmi'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import styles from './style.module.scss'

import { mutedState } from 'app/states/settings'
import { gaEvent } from 'lib/gtag'
import { networkChainId, networkShortNameFor } from 'utils/network'
import { truncateAddress } from 'utils/string'
import { getEtherscanUrl } from 'utils/url'
import { useSettings, useSwitchNetwork, useWeb3 } from 'hooks'
import { sidebarVariants } from './constants'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Jazzicon } from 'components/Jazzicon'

type AccountSidebarProps = {
  close(): void
}

export function AccountSidebar({ close }: AccountSidebarProps) {
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { disconnect: _disconnect } = useWeb3()
  const { toggleMuted } = useSettings()
  const { switchNetwork } = useSwitchNetwork()

  const { address: account } = useAccount()
  const { chain } = useNetwork()
  const networkMismatch = chain && chain.id !== networkChainId

  const muted = useRecoilValue(mutedState)

  function disconnect() {
    close()
    setTimeout(_disconnect, 500)
  }

  function handleSwitchNetwork() {
    close()
    switchNetwork()
  }

  function handleCopy() {
    setCopied(true)
    setTimeout(() => setCopied(false), 500)
    gaEvent({
      name: 'copy_address',
    })
  }

  function handleEtherscan() {
    gaEvent({
      name: 'open_etherscan',
      params: {
        type: 'account',
        address: account,
      },
    })
  }

  if (!account) {
    return null
  }

  return (
    <motion.aside
      className={styles.accountSidebar}
      ref={menuRef}
      key="accountSidebar"
      variants={sidebarVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ background: 'white' }}
    >
      <h1 className={styles.title}>Account</h1>
      <button className={styles.closeButton} type="button" onClick={close}>
        <Icon id="close" ariaLabel="Close sidebar" />
      </button>

      <header className={styles.header}>
        <Jazzicon className={styles.jazzicon} address={account} diameter={40} />

        <div className={styles.detail}>
          <div className={styles.account}>
            <strong>{truncateAddress(account)}</strong>
            <CopyToClipboard text={account} onCopy={handleCopy}>
              <button className={clsx({ [styles.copied]: copied })}>
                <Icon id={copied ? 'check' : 'clipboard'} />
              </button>
            </CopyToClipboard>
            <a
              href={getEtherscanUrl(account)}
              onClick={handleEtherscan}
              target="_blank"
              rel="noopener"
            >
              <Icon id="externalLink" ariaLabel="Go to Etherscan" />
            </a>
          </div>
          <span className={styles.wallet}>MetaMask</span>
        </div>
      </header>

      <dl className={styles.details}>
        <div>
          <dt>Network</dt>
          <dd>
            {networkMismatch ? (
              <Button
                variant="tertiary"
                size="small"
                onClick={handleSwitchNetwork}
              >
                Switch Network
              </Button>
            ) : (
              <>
                <span className={styles.ethereum}>
                  <Icon id="ethereumSimple" />
                </span>
                {networkShortNameFor(networkChainId)}
              </>
            )}
          </dd>
        </div>
        <div>
          <dt>Sound</dt>
          <dd>
            <Button variant="tertiary" size="small" onClick={toggleMuted}>
              {muted ? 'Unmute' : 'Mute'}
            </Button>
          </dd>
        </div>
      </dl>

      <Button
        className={styles.disconnectButton}
        variant="danger"
        size="small"
        onClick={disconnect}
        fullWidth
      >
        Disconnect
      </Button>
    </motion.aside>
  )
}
