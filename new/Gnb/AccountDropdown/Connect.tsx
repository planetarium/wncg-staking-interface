import { motion } from 'framer-motion'
import styled from 'styled-components'

import { useAccount, useConnectWallets } from 'hooks'

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

const StyledAccountConnect = styled(motion.button)`
  height: 40px;
  font-size: 14px;
  color: white;
  background-color: purple;
`

function AccountConnect() {
  const { isConnected, isConnecting } = useAccount()
  const { connect } = useConnectWallets()

  const disabled = isConnected || isConnecting

  return (
    <StyledAccountConnect
      className="accountConnect"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={motionVariants}
      onClick={connect}
      disabled={disabled}
    >
      Connect Wallet
    </StyledAccountConnect>
  )
}

export default AccountConnect
