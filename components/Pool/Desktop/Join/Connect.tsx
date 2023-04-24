import { AnimatePresence } from 'framer-motion'

import { fadeIn } from 'constants/motionVariants'
import { useAuth, useConnect } from 'hooks'

import { StyledJoinConnect } from './styled'
import Button from 'components/Button'

function JoinConnect() {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()

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
          <h3 className="title">Connect wallet and get LP tokens!</h3>
          <Button
            className="connectButton"
            onClick={openConnectModal}
            $size="lg"
          >
            Connect wallet
          </Button>
        </StyledJoinConnect>
      )}
    </AnimatePresence>
  )
}

export default JoinConnect
