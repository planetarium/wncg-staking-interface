import { MouseEvent, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { explorerUrlFor } from 'utils/explorerUrlFor'
import { truncateAddress } from 'utils/truncateAddress'
import { useAuth, useChain, useCopy, useDisconnect } from 'hooks'

import { StyledSidebarAccount } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Jazzicon from 'components/Jazzicon'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type SidebarAccountProps = {
  closeSidebar(e: MouseEvent): void
}

export default function SidebarAccount({ closeSidebar }: SidebarAccountProps) {
  const [show, setShow] = useState(false)

  const { account, connector, isConnected } = useAuth()
  const { chainId, shortName } = useChain()

  const { onCopy, copied } = useCopy()
  const disconnect = useDisconnect({
    onSuccess: closeSidebar,
  })

  function toggle() {
    setShow((prev) => !prev)
  }

  const showDetails = !!isConnected && show

  return (
    <StyledSidebarAccount $expanded={showDetails}>
      <div className="header">
        <h3 className="title">Network</h3>

        {!isConnected && (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button onClick={openConnectModal} $size="md">
                Connect wallet
              </Button>
            )}
          </ConnectButton.Custom>
        )}

        {isConnected && (
          <motion.button
            {...EXIT_MOTION}
            variants={ANIMATION_MAP.fadeIn}
            className="toggleButton"
            type="button"
            onClick={toggle}
          >
            <Jazzicon address={account!} diameter={32} />
            <strong className="address">
              {truncateAddress(account!, 6, 4)}
            </strong>

            <Icon icon={show ? 'chevronDown' : 'chevronRight'} $size={24} />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.dd
            className="accountDetails"
            {...EXIT_MOTION}
            variants={ANIMATION_MAP.slideInDown}
          >
            <div className="buttonGroup">
              <CopyToClipboard text={account!} onCopy={onCopy}>
                <button className={clsx({ copied })} type="button">
                  <span className="text">
                    {copied ? 'Copied!' : 'Copy Address'}
                  </span>
                  <Icon icon={copied ? 'check' : 'copy'} />
                </button>
              </CopyToClipboard>

              <Link
                href={explorerUrlFor(chainId, account!)}
                onClick={closeSidebar}
                target="_blank"
                rel="noopener"
              >
                <span className="text">View Details</span>
                <Icon icon="outlink" />
              </Link>
            </div>

            <dl className="accountDetailList">
              <div className="accountDetailItem">
                <dt>Network</dt>
                <dd>
                  <span className="dot" aria-hidden />
                  {shortName}
                </dd>
              </div>

              <div className="accountDetailItem">
                <dt>Wallet</dt>
                <dd>{connector?.name}</dd>
              </div>
            </dl>

            <Button
              className="disconnectButton"
              onClick={disconnect}
              $variant="secondary"
              $size="md"
            >
              Disconnect
            </Button>
          </motion.dd>
        )}
      </AnimatePresence>
    </StyledSidebarAccount>
  )
}
