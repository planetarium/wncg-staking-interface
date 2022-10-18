import { AnimatePresence } from 'framer-motion'

import { fadeIn } from 'constants/motionVariants'
import { useAccount, useConnectWallets } from 'hooks'

import { StyledJoinConnect } from './styled'
import Button from 'new/Button'

function JoinConnect() {
  const { isConnected } = useAccount()
  const { connect } = useConnectWallets()

  return (
    <AnimatePresence>
      {!isConnected && (
        <StyledJoinConnect
          className="poolJoinConnect"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <h3 className="title">Connect wallet and Get LP Tokens!</h3>
          <Button className="connectButton" onClick={connect} $size="lg">
            Connect wallet
          </Button>
        </StyledJoinConnect>
      )}
    </AnimatePresence>
  )
}

export default JoinConnect
