import { PropsWithChildren, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { useMediaQuery } from 'hooks'

import { StyledLayout, StyledMain } from './styled'
import Favicon from 'components/Favicon'
import MainFavicon from 'components/MainFavicon'
import GlobalHooks from 'components/GlobalHooks'
import Suspense from 'components/Suspense'
import Gnb from './Gnb'

const Alerts = dynamic(() => import('./Alerts'), {
  ssr: false,
})

const Pool = dynamic(() => import('components/Pool'), {
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
    return <StyledLayout layoutRoot>{children}</StyledLayout>
  }

  return (
    <>
      <Head>{isRootPage ? <MainFavicon /> : <Favicon />}</Head>

      <StyledLayout layoutRoot $root={isRootPage}>
        <Alerts />

        <Gnb />

        <StyledMain ref={mainRef} layout>
          {children}
        </StyledMain>

        <GlobalHooks />
      </StyledLayout>

      {!isRootPage && (
        <>
          <Modals />
          <Suspense>
            <Pool />
          </Suspense>
        </>
      )}
    </>
  )
}

export default Layout
