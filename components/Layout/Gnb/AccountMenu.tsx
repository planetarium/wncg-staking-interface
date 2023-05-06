import { memo, useCallback, useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import CopyToClipboard from 'react-copy-to-clipboard'
import Link from 'next/link'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'

import { currentChainAtom } from 'states/system'
import { EXIT_MOTION } from 'config/motions'
import { dropdownTransition, slideInDown } from 'config/motionVariants'
import { explorerUrlFor } from 'utils/explorerUrlFor'
import { truncateAddress } from 'utils/truncateAddress'
import { useAuth, useCopy, useDisconnect } from 'hooks'

import { StyledGnbAccountMenu } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Jazzicon from 'components/Jazzicon'

type AccountMenuProps = {
  closeMenu(): void
}

function AccountMenu({ closeMenu }: AccountMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { onCopy, copied } = useCopy()

  const { account, connector } = useAuth()
  const disconnect = useDisconnect({
    onSuccess: closeMenu,
  })

  const chain = useAtomValue(currentChainAtom)

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!menuRef?.current?.contains(e.target as Node)) closeMenu()
    },
    [closeMenu]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur, { passive: true })
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })

  return (
    <StyledGnbAccountMenu
      {...EXIT_MOTION}
      ref={menuRef}
      variants={slideInDown}
      transition={dropdownTransition}
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
            href={explorerUrlFor(account ?? '')}
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
            {chain?.name}
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

export default memo(AccountMenu)
