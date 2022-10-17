import { useCallback, useRef, useState } from 'react'
import { useMount, useUnmount } from 'react-use'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useAtomValue } from 'jotai'
import { useAccount, useNetwork } from 'wagmi'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import styles from './style.module.scss'

import { mutedAtom } from 'states/userSettings'
import { gaEvent } from 'lib/gtag'
import { networkChainId, networkShortNameFor } from 'utils/network'
import { truncateAddress } from 'utils/string'
import { getEtherscanUrl } from 'utils/url'
import { useConnectWallets, useSettings, useSwitchNetwork } from 'hooks'
import { menuTransition, menuVariants } from './constants'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Jazzicon } from 'components/Jazzicon'

type AccountUserMenuProps = {
  close(): void
}

export function AccountUserMenu({ close }: AccountUserMenuProps) {
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { disconnect: _disconnect } = useConnectWallets()
  const { toggleMuted } = useSettings()
  const { switchNetwork } = useSwitchNetwork()

  const { address: account } = useAccount()
  const { chain } = useNetwork()
  const networkMismatch = chain && chain.id !== networkChainId

  const muted = useAtomValue(mutedAtom)

  function disconnect() {
    close()
    setTimeout(_disconnect, 300)
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

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        close()
        window.removeEventListener('click', closeOnBlur)
      }
    },
    [close]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur)
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })

  if (!account) {
    return null
  }

  return (
    <motion.aside
      className={styles.accountUserMenu}
      ref={menuRef}
      key="accountUserMenu"
      variants={menuVariants}
      transition={menuTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h1 className={styles.title}>Account</h1>

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
