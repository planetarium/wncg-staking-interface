import { useRef } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Link from 'next/link'
import clsx from 'clsx'

import {
  ANIMATION_MAP,
  EXIT_MOTION,
  TRANSITION_MAP,
} from 'config/constants/motions'
import { explorerUrlFor } from 'utils/explorerUrlFor'
import { truncateAddress } from 'utils/truncateAddress'
import {
  useAuth,
  useChain,
  useCloseOnBlur,
  useCopy,
  useDisconnect,
} from 'hooks'

import { StyledGnbAccountMenu } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Jazzicon from 'components/Jazzicon'

type AccountMenuProps = {
  closeMenu(): void
}

function AccountMenu({ closeMenu }: AccountMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const { account, connector } = useAuth()
  const { chainId, shortName } = useChain()
  const { onCopy, copied } = useCopy()

  const disconnect = useDisconnect({
    onSuccess: closeMenu,
  })

  useCloseOnBlur(menuRef, closeMenu)

  return (
    <StyledGnbAccountMenu
      {...EXIT_MOTION}
      ref={menuRef}
      variants={ANIMATION_MAP.slideInDown}
      transition={TRANSITION_MAP.dropdown}
      role="menu"
    >
      <header className="header">
        <h2>
          <Jazzicon className="avatar" address={account!} diameter={24} />
          <strong className="address">{truncateAddress(account!)}</strong>
        </h2>

        <div className="utils">
          <CopyToClipboard text={account!} onCopy={onCopy}>
            <button className={clsx({ copied })} type="button">
              <span className="text">
                {copied ? 'Copied!' : 'Copy address'}
              </span>
              <Icon icon={copied ? 'check' : 'copy'} />
            </button>
          </CopyToClipboard>

          <Link
            href={explorerUrlFor(chainId, account!)}
            onClick={closeMenu}
            target="_blank"
            rel="noopener"
          >
            <span className="text">View details</span>
            <Icon icon="outlink" />
          </Link>
        </div>
      </header>

      <dl className="detailList">
        <div className="detailItem">
          <dt>Network</dt>
          <dd>
            <span className="dot" aria-hidden />
            {shortName}
          </dd>
        </div>
        <div className="detailItem">
          <dt>Wallet</dt>
          <dd>{connector?.name}</dd>
        </div>
      </dl>

      <footer className="footer">
        <Button onClick={disconnect} $variant="secondary" $size="md">
          Disconnect
        </Button>
      </footer>
    </StyledGnbAccountMenu>
  )
}

export default AccountMenu
