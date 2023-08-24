import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

import {
  ANIMATION_MAP,
  EXIT_MOTION,
  TRANSITION_MAP,
} from 'config/constants/motions'
import { useAuth } from 'hooks'
import { useAddLiquidityForm } from 'hooks/pancakeswap'

import { modalOverlayVariants } from 'components/Modals/constants'
import {
  StyledPancakeSwapPoolMobile,
  StyledPoolMobileContainer,
} from './styled'
import { StyledModalOverlay } from 'components/Modals/styled'
import Connect from './Connect'
import Content from './Content'
import Header from './Header'

type PancakeSwapPoolMobileProps = {
  show: boolean
  closePool(): void
}

function PancakeSwapPoolMobile({
  show,
  closePool,
}: PancakeSwapPoolMobileProps) {
  const { account, prevAccount, isConnected } = useAuth()

  const addLiquidityFormReturns = useAddLiquidityForm()
  const { resetFields, setActiveField, setFocusedElement } =
    addLiquidityFormReturns

  useEffect(() => {
    if (account !== prevAccount) {
      resetFields()
    }
  }, [account, prevAccount, resetFields])

  return (
    <>
      <AnimatePresence>
        {show && (
          <StyledModalOverlay
            {...EXIT_MOTION}
            variants={modalOverlayVariants}
            transition={TRANSITION_MAP.modal}
            onClick={closePool}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show && (
          <StyledPoolMobileContainer
            {...EXIT_MOTION}
            variants={ANIMATION_MAP.appearInUp}
            transition={TRANSITION_MAP.modal}
            style={{ maxWidth: 'unset', width: '100%' }}
          >
            <StyledPancakeSwapPoolMobile>
              <Header closePool={closePool} />

              {!!isConnected ? (
                <Content {...addLiquidityFormReturns} />
              ) : (
                <Connect />
              )}
            </StyledPancakeSwapPoolMobile>
          </StyledPoolMobileContainer>
        )}
      </AnimatePresence>
    </>
  )
}

export default PancakeSwapPoolMobile
