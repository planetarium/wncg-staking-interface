import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { useAuth, useConnect } from 'hooks'

import { StyledPancakeSwapPoolMobileConnect } from './styled'
import Button from 'components/Button'

function JoinConnect() {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()

  return (
    <AnimatePresence>
      {!isConnected && (
        <StyledPancakeSwapPoolMobileConnect
          {...EXIT_MOTION}
          variants={ANIMATION_MAP.fadeIn}
        >
          <Button
            className="connectButton"
            onClick={openConnectModal}
            $size="md"
          >
            Connect wallet
          </Button>
        </StyledPancakeSwapPoolMobileConnect>
      )}
    </AnimatePresence>
  )
}

export default JoinConnect
