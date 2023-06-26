import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP } from 'config/constants/motions'
import { useAuth, useConnect } from 'hooks'

import { StyledJoinConnect } from './styled'
import Button from 'components/Button'

function BalancerJoinConnect() {
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
          variants={ANIMATION_MAP.fadeIn}
        >
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

export default BalancerJoinConnect
