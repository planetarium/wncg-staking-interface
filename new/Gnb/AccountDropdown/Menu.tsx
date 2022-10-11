import { useCallback, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useMount, useUnmount } from 'react-use'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { truncateAddress } from 'utils/string'
import { getEtherscanUrl } from 'utils/url'
import { useAccount, useConnectWallets, useNetwork } from 'hooks'

import { Jazzicon } from 'components/Jazzicon'

const StyledAccountDropdownMenu = styled(motion.aside)`
  position: absolute;
  z-index: 100;
  top: calc(100% + 8px);
  right: 0;
  width: max-content;
  padding: 8px;
  background-color: white;
  color: black;

  header {
    margin-bottom: 8px;

    h2 {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;
    }
  }

  .utils {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > * {
      padding: 8px;
      margin-right: 8px;
      margin-left: 8px;
      font-size: 14px;
      color: white;
      background-color: #666;
    }
  }

  dl {
    font-size: 14px;

    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
    }
  }

  footer {
    button {
      display: block;
      width: 92%;
      padding: 8px;
      margin: 0 auto;
      background-color: #000;
    }
  }
`

const motionVariants = {
  initial: {
    opacity: 0,
    y: '-100%',
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: '-100%',
  },
}

type AccountDropdownMenuProps = {
  close(): void
}

function AccountDropdownMenu({ close }: AccountDropdownMenuProps) {
  const [copied, setCopied] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { account, connector } = useAccount()
  const { disconnect } = useConnectWallets()
  const { chain } = useNetwork()

  const etherscanUrl = getEtherscanUrl(account)

  function handleCopy() {
    setCopied(true)
    const id = setTimeout(() => setCopied(false), 500)
    if (timeoutId) clearTimeout(timeoutId)
    setTimeoutId(id)
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
      variants={motionVariants}
    >
      <header>
        <h2>
          <Jazzicon address={account} />
          <span>{truncateAddress(account)}</span>
        </h2>
      </header>

      <div className="utils">
        <CopyToClipboard text={account!} onCopy={handleCopy}>
          <button>{copied ? 'Copied!' : 'Copy Address'}</button>
        </CopyToClipboard>
        <a href={etherscanUrl} target="_blank" rel="noopener">
          View Details
        </a>
      </div>

      <dl>
        <div>
          <dt>Network</dt>
          <dd>{chain?.name}</dd>
        </div>
        <div>
          <dt>Wallet</dt>
          <dd>{connector?.name}</dd>
        </div>
      </dl>

      <footer>
        <button type="button" onClick={disconnect}>
          Disconnect
        </button>
      </footer>
    </StyledAccountDropdownMenu>
  )
}

export default AccountDropdownMenu
