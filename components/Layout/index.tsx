import { PropsWithChildren, useRef } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useMediaQuery } from 'hooks'

import { StyledLayout, StyledMain } from './styled'
import Favicon from 'components/Favicon'
import RootFavicon from 'components/RootFavicon'
import Suspense from 'components/Suspense'
import Gnb from './Gnb'

const Alerts = dynamic(() => import('./Alerts'), {
  ssr: false,
})

const BalancerPool = dynamic(() => import('components/BalancerPool'), {
  ssr: false,
})

const Modals = dynamic(() => import('components/Modals'), {
  ssr: false,
})

function Layout({ children }: PropsWithChildren) {
  const mainRef = useRef<HTMLDivElement>(null)

  const { route, pathname } = useRouter()

  useMediaQuery()

  const isRootPage = pathname === '/'
  const isErrorPage = ['/404', '/500'].includes(route)

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
      <Head>{isRootPage ? <RootFavicon /> : <Favicon />}</Head>
      <StyledLayout layoutRoot $root={isRootPage}>
        <Alerts />

        <Gnb />

        <StyledMain ref={mainRef} layout>
          {children}
        </StyledMain>
      </StyledLayout>

      {!isRootPage && (
        <>
          <Modals />
          <Suspense>
            <BalancerPool />
          </Suspense>
        </>
      )}
    </>
  )
}

export default Layout
