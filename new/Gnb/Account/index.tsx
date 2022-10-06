import { memo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'

import { accountState } from 'app/states/connection'
import { truncateAddress } from 'utils/string'
import { useConnection } from 'hooks'

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
  const account = useRecoilValue(accountState)
  const { connect } = useConnection()

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
          onClick={connect}
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
