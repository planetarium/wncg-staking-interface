import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP } from 'config/constants/motions'
import { useAuth } from 'hooks'

import { StyledJoinConnect } from './styled'
import Button from 'components/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function BalancerJoinConnect() {
  const { isConnected } = useAuth()

  return (
    <AnimatePresence>
      {!isConnected && (
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
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
        </ConnectButton.Custom>
      )}
    </AnimatePresence>
  )
}

export default BalancerJoinConnect
