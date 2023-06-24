import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { useAuth, useConnect } from 'hooks'

import { StyledPoolMobileConnect } from './styled'
import Button from 'components/Button'

function JoinConnect() {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()

  return (
    <AnimatePresence>
      {!isConnected && (
        <StyledPoolMobileConnect
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
        </StyledPoolMobileConnect>
      )}
    </AnimatePresence>
  )
}

export default JoinConnect
