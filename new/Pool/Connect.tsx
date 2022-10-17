import { AnimatePresence } from 'framer-motion'

import { fadeIn } from 'constants/motionVariants'
import { useAccount, useConnectWallets } from 'hooks'

import { StyledJoinFormConnect } from './styled'
import Button from 'new/Button'

function JoinFormConnect() {
  const { isConnected } = useAccount()
  const { connect } = useConnectWallets()

  return (
    <AnimatePresence>
      {!isConnected && (
        <StyledJoinFormConnect
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
        </StyledJoinFormConnect>
      )}
    </AnimatePresence>
  )
}

export default JoinFormConnect
