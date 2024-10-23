import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP } from 'config/constants/motions'
import { useAuth } from 'hooks'

import { StyledPancakeSwapAddLiquidityConnect } from './styled'
import Button from 'components/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function JoinConnect() {
  const { isConnected } = useAuth()

  return (
    <AnimatePresence>
      {!isConnected && (
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <StyledPancakeSwapAddLiquidityConnect
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
            </StyledPancakeSwapAddLiquidityConnect>
          )}
        </ConnectButton.Custom>
      )}
    </AnimatePresence>
  )
}

export default JoinConnect
