import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import { networkChainId } from 'utils/network'
import { useAccount, useNetwork, usePrices } from 'hooks'
import { mainVariants } from './constants'

import { StyledLayout, StyledMain } from './styled'
import Alert from 'components/Alert'
import Gnb from 'components/Gnb'
import GlobalFooter from 'components/GlobalFooter'
import Pool from 'components/Pool'

type LayoutProps = {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { invalidPriceError } = usePrices()
  const { query } = useRouter()

  const showPoolPage = !!query?.pool

  const networkMismatch =
    (isConnected && Number(chain?.id) !== networkChainId) ?? false

  const error = networkMismatch
    ? 'networkMismatch'
    : invalidPriceError
    ? 'invalidPrice'
    : undefined

  return (
    <>
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

      <AnimatePresence>{showPoolPage && <Pool isModal />}</AnimatePresence>
    </>
  )
}

export default Layout
