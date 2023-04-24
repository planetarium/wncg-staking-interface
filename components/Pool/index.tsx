import { useRouter } from 'next/router'

import { getQueryString } from 'utils/getQueryString'
import { useResponsive } from 'hooks'

import PoolDesktop from './Desktop'
import PoolMobile from './Mobile'

export default function Pool() {
  const { isMobile } = useResponsive()
  const router = useRouter()

  const showPoolPage =
    router.pathname === '/wncg' && getQueryString(router.query.modal) === 'open'

  function closePool() {
    router.push('/wncg')
  }

  if (isMobile) {
    return <PoolMobile show={showPoolPage} closePool={closePool} />
  }

  return <PoolDesktop show={showPoolPage} closePool={closePool} />
}
