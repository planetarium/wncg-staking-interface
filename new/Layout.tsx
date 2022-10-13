import { ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'

import { networkChainId } from 'utils/network'
import { useAccount, useNetwork, usePrices } from 'hooks'
import { mainVariants } from './constants'

import { StyledLayout, StyledMain } from './styled'
import Alert from 'new/Alert'
import Gnb from 'new/Gnb'
import GlobalFooter from 'new/GlobalFooter'

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
        variants={mainVariants}
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
