import { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { networkChainId } from 'utils/network'
import { useAccount, useNetwork, usePrices } from 'hooks'

import Alert from 'new/Alert'
import Gnb from 'new/Gnb'
import GlobalFooter from 'new/GlobalFooter'

const motionVariants = {
  initial: {
    y: 0,
  },
  animate: {
    y: 56,
  },
  exit: {
    y: 0,
  },
}

const StyledLayout = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
`

const StyledMain = styled(motion.main)<{ $shrink: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  max-height: 100vh;
  transition: 500ms;
  overflow: hidden;

  ${({ $shrink }) =>
    $shrink &&
    css`
      max-height: calc(100vh - 56px);
    `}

  .gnb,
  .globalFooter {
    flex-shrink: 0;
  }

  .content {
    overflow: auto;
  }
`

type LayoutProps = {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { invalidPriceError } = usePrices()

  const networkMismatch =
    (isConnected && Number(chain?.id) !== networkChainId) ?? false

  const error = networkMismatch
    ? 'networkMismatch'
    : invalidPriceError
    ? 'invalidPrice'
    : undefined

  return (
    <StyledLayout>
      <AnimatePresence>{!!error && <Alert error={error} />}</AnimatePresence>

      <StyledMain
        initial="initial"
        animate={!!error ? 'animate' : undefined}
        exit="exit"
        variants={motionVariants}
        transition={{ duration: 0.3, stiffness: 30 }}
        $shrink={!!error}
      >
        <Gnb />
        <div className="content">{children}</div>
        <GlobalFooter />
      </StyledMain>
    </StyledLayout>
  )
}

export default Layout
