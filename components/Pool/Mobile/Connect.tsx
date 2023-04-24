import { AnimatePresence } from 'framer-motion'

import { fadeIn } from 'constants/motionVariants'
import { useAuth, useConnect } from 'hooks'

import { StyledPoolMobileConnect } from './styled'
import Button from 'components/Button'
import { EXIT_MOTION } from 'config/motions'

function JoinConnect() {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()

  return (
    <AnimatePresence>
      {!isConnected && (
        <StyledPoolMobileConnect {...EXIT_MOTION} variants={fadeIn}>
          <h3 className="title">Connect wallet and get LP tokens!</h3>
          <Button
            className="connectButton"
            onClick={openConnectModal}
            $size="md"
          >
            Connect wallet
          </Button>
        </StyledPoolMobileConnect>
      )}
    </AnimatePresence>
  )
}

export default JoinConnect
