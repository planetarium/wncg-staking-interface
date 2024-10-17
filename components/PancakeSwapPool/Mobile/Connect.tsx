import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { useAuth } from 'hooks'

import { StyledPancakeSwapPoolMobileConnect } from './styled'
import Button from 'components/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function JoinConnect() {
  const { isConnected } = useAuth()

  return (
    <AnimatePresence>
      {!isConnected && (
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
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
        </ConnectButton.Custom>
      )}
    </AnimatePresence>
  )
}

export default JoinConnect
