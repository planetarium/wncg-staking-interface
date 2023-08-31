import { PropsWithChildren, useRef } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { SUPPORTED_CHAINS } from 'config/chains'
import { isBsc } from 'utils/isBsc'
import { isEthereum } from 'utils/isEthereum'
import { useChain, useMediaQuery } from 'hooks'

import { StyledLayout, StyledMain } from './styled'
import Favicon from 'components/Favicon'
import RootFavicon from 'components/RootFavicon'
import Suspense from 'components/Suspense'
import RootGnb from './Gnb/Root'
import MainGnb from './Gnb/Main'

const Alerts = dynamic(() => import('./Alerts'), {
  ssr: false,
})

const BalancerPool = dynamic(() => import('components/BalancerPool'), {
  ssr: false,
})

const Gnb = dynamic(() => import('./Gnb'), {
  ssr: false,
})

const Modals = dynamic(() => import('components/Modals'), {
  ssr: false,
})

const PancakeSwapPool = dynamic(() => import('components/PancakeSwapPool'), {
  ssr: false,
})

function Layout({ children }: PropsWithChildren) {
  const mainRef = useRef<HTMLDivElement>(null)

  const { chainId } = useChain()
  const { route, pathname, query } = useRouter()

  useMediaQuery()

  const isRootPage = pathname === '/'

  console.log(1111, pathname, isRootPage)

  if (isRootPage) {
    return (
      <>
        <Head>
          <RootFavicon />
        </Head>

        <StyledLayout layoutRoot $root={isRootPage}>
          <RootGnb />

          <StyledMain ref={mainRef} layout>
            {children}
          </StyledMain>
        </StyledLayout>
      </>
    )
  }

  const isErrorPage =
    ['/404', '/500'].includes(route) ||
    (query.chainId &&
      !SUPPORTED_CHAINS.includes(Number(query.chainId) as ChainId))

  if (isErrorPage) {
    return (
      <StyledLayout layoutRoot>
        <Head>
          <Favicon />
        </Head>

        {children}
      </StyledLayout>
    )
  }

  return (
    <>
      <Head>
        <Favicon />
      </Head>

      <StyledLayout layoutRoot $root={isRootPage}>
        <Suspense>
          <Alerts />
        </Suspense>

        <MainGnb />

        <StyledMain ref={mainRef} layout>
          {children}
        </StyledMain>
      </StyledLayout>

      <Modals />
      <Suspense>
        {isEthereum(chainId) && (
          <Suspense>
            <BalancerPool />
          </Suspense>
        )}

        {isBsc(chainId) && <PancakeSwapPool />}
      </Suspense>
    </>
  )
}

export default Layout
