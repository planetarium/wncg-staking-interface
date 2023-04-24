import { memo, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

import { EXIT_MOTION } from 'config/motions'

import { useAuth, useJoinForm } from 'hooks'

import {
  modalMobileVariants,
  modalOverlayVariants,
  modalTransition,
} from 'components/Modals/constants'
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
  const { hideAlert, resetFields } = joinFormReturns

  useEffect(() => {
    if (account !== prevAccount) {
      resetFields()
      hideAlert()
    }
  }, [account, hideAlert, prevAccount, resetFields])

  return (
    <>
      <AnimatePresence>
        {show && (
          <StyledModalOverlay
            {...EXIT_MOTION}
            variants={modalOverlayVariants}
            transition={modalTransition}
            onClick={closePool}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show && (
          <StyledPoolMobileContainer
            {...EXIT_MOTION}
            variants={modalMobileVariants}
            transition={modalTransition}
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
