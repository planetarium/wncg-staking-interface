import { useCallback, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useMount, useUnmount } from 'react-use'

import { slideInDown } from 'constants/motionVariants'
import { truncateAddress } from 'utils/string'
import { getEtherscanUrl } from 'utils/url'
import { useAccount, useConnectWallets, useNetwork } from 'hooks'

import { StyledAccountDropdownMenu } from './styled'
import Button from 'new/Button'
import Jazzicon from 'new/Jazzicon'
import SvgIcon from 'new/SvgIcon'

type AccountDropdownMenuProps = {
  close(): void
}

function AccountDropdownMenu({ close }: AccountDropdownMenuProps) {
  const [copied, setCopied] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { account, connector } = useAccount()
  const { disconnect: initDisconnect } = useConnectWallets()
  const { chain } = useNetwork()

  const etherscanUrl = getEtherscanUrl(account)

  function handleCopy() {
    setCopied(true)
    const id = setTimeout(() => setCopied(false), 500)
    if (timeoutId) clearTimeout(timeoutId)
    setTimeoutId(id)
  }

  function disconnect() {
    initDisconnect()
    close()
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
    if (timeoutId) clearTimeout(timeoutId)
    window.removeEventListener('click', closeOnBlur)
  })

  return (
    <StyledAccountDropdownMenu
      className="accountDropdownMenu"
      ref={menuRef}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideInDown}
    >
      <header className="header">
        <h2>
          <Jazzicon className="avatar" address={account} diameter={24} />
          <strong className="address">{truncateAddress(account)}</strong>
        </h2>

        <div className="utils">
          <CopyToClipboard text={account!} onCopy={handleCopy}>
            <button type="button">
              {copied ? 'Copied!' : 'Copy Address'}
              <SvgIcon icon="copy" $size={16} ariaHidden />
            </button>
          </CopyToClipboard>
          <a href={etherscanUrl} onClick={close} target="_blank" rel="noopener">
            View Details
            <SvgIcon icon="link" $size={16} ariaHidden />
          </a>
        </div>
      </header>

      <dl className="detail">
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

      <footer>
        <Button onClick={disconnect} $variant="secondary" $size="md">
          Disconnect
        </Button>
      </footer>
    </StyledAccountDropdownMenu>
  )
}

export default AccountDropdownMenu
