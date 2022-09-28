import { memo, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { AnimatePresence, motion } from 'framer-motion'

import { truncateAddress } from 'utils/string'
import { useWeb3 } from 'hooks'

import { AccountMenu } from './Menu'

const motionVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

const StyledAccount = styled(motion.div)`
  position: relative;

  button {
    color: white;
  }
`

const StyledConnectButton = styled(motion.button)`
  button {
    color: white;
  }
`

function Account() {
  const [showMenu, setShowMenu] = useState(false)
  const { address: account } = useAccount()
  const { openConnectModal } = useWeb3()

  function toggle() {
    setShowMenu((prev) => !prev)
  }

  return (
    <AnimatePresence>
      {account ? (
        <StyledAccount
          initial="initial"
          animate="animate"
          exit="exit"
          variants={motionVariants}
        >
          <button type="button" onClick={toggle}>
            {truncateAddress(account, 6, 6)}
          </button>
          <AnimatePresence>
            {showMenu && <AccountMenu account={account} />}
          </AnimatePresence>
        </StyledAccount>
      ) : (
        <StyledConnectButton
          type="button"
          onClick={openConnectModal}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={motionVariants}
        >
          Connect
        </StyledConnectButton>
      )}
    </AnimatePresence>
  )
}

export default memo(Account)
