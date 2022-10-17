import { fadeIn } from 'constants/motionVariants'
import { AnimatePresence } from 'framer-motion'
import { useAccount, useConnectWallets } from 'hooks'
import Button from 'new/Button'

import { StyledJoinFormConnect } from './styled'

function JoinFormConnect() {
  const { isConnected } = useAccount()
  const { connect } = useConnectWallets()

  return (
    <AnimatePresence>
      {!isConnected && (
        <StyledJoinFormConnect
          className="joinFormConnect"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <h3 className="title">Connect wallet and Get LP Tokens!</h3>
          <Button className="connectButton" onClick={connect} $size="lg">
            Connect wallet
          </Button>
        </StyledJoinFormConnect>
      )}
    </AnimatePresence>
  )
}

export default JoinFormConnect
