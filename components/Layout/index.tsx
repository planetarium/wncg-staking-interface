import { PropsWithChildren, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { useMediaQuery, useResponsive } from 'hooks'

import { StyledLayout, StyledMain } from './styled'

import Modals from 'components/Modals'
import Code from 'components/Code'
import GlobalHooks from 'components/GlobalHooks'
import Suspense from 'components/Suspense'
import Gnb from './Gnb'

const Alerts = dynamic(() => import('./Alerts'), {
  ssr: false,
})

const Pool = dynamic(() => import('components/Pool'), {
  ssr: false,
})

function Layout({ children }: PropsWithChildren) {
  const mainRef = useRef<HTMLDivElement>(null)

  const { route, pathname } = useRouter()
  useMediaQuery()
  const { bp } = useResponsive()

  const isRootPage = pathname === '/'

  const isErrorPage = ['/404', '/500'].includes(route)

  if (isErrorPage) {
    return <StyledLayout layoutRoot>{children}</StyledLayout>
  }

  return (
    <StyledLayout layoutRoot $root={isRootPage}>
      <Alerts />

      <Gnb />

      <Code data={bp} top={0} left={0} maxWidth={100} />

      <StyledMain ref={mainRef} layout>
        {children}
      </StyledMain>

      {!isRootPage && (
        <Suspense>
          <Pool />
        </Suspense>
      )}

      <GlobalHooks />
      {!isRootPage && <Modals />}
    </StyledLayout>
  )
}

export default Layout
