import { PropsWithChildren, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useMediaQuery, useResponsive } from 'hooks'

import { StyledLayout, StyledMain } from './styled'
import Favicon from 'components/Favicon'
import GlobalHooks from 'components/GlobalHooks'
import Suspense from 'components/Suspense'
import Gnb from './Gnb'
import Code from 'components/Code'

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
  const { bp } = useResponsive()
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
      <Head>
        <Favicon />
      </Head>

      <StyledLayout layoutRoot $root={isRootPage}>
        <Alerts />

        <Gnb />

        <Code data={bp} z={1000} top={0} left={0} />
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
