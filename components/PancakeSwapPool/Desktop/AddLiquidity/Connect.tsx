import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP } from 'config/constants/motions'
import { useAuth, useConnect } from 'hooks'

import { StyledPancakeSwapAddLiquidityConnect } from './styled'
import Button from 'components/Button'

function JoinConnect() {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()

  return (
    <AnimatePresence>
      {!isConnected && (
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
    </AnimatePresence>
  )
}

export default JoinConnect
