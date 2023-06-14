import { memo, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

import {
  ANIMATION_MAP,
  EXIT_MOTION,
  TRANSITION_MAP,
} from 'config/constants/motions'
import { useAuth } from 'hooks'
import { useJoinForm } from 'hooks/balancer'

import { modalOverlayVariants } from 'components/Modals/constants'
import { StyledPoolMobile, StyledPoolMobileContainer } from './styled'
import { StyledModalOverlay } from 'components/Modals/styled'
import Header from './Header'
import Connect from './Connect'
import Content from './Content'

type PoolMobileProps = {
  show: boolean
  closePool(): void
}

function PoolMobile({ show, closePool }: PoolMobileProps) {
  const { account, prevAccount, isConnected } = useAuth()

  const joinFormReturns = useJoinForm()
  const { resetFields } = joinFormReturns

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
            <StyledPoolMobile>
              <Header closePool={closePool} />

              {!!isConnected ? <Content {...joinFormReturns} /> : <Connect />}
            </StyledPoolMobile>
          </StyledPoolMobileContainer>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(PoolMobile)
