import dynamic from 'next/dynamic'
import { useAtom } from 'jotai'

import { showPoolAtom } from 'states/ui'
import { useResponsive } from 'hooks'

import Suspense from 'components/Suspense'
import BalancerPoolDesktop from './Desktop'
import BalancerPoolMobile from './Mobile'

function BalancerPool() {
  const { isMobile } = useResponsive()

  const [showPool, setShowPool] = useAtom(showPoolAtom)

  function closePool() {
    setShowPool(false)
  }

  if (isMobile) {
    return (
      <Suspense>
        <BalancerPoolMobile show={showPool} closePool={closePool} />
      </Suspense>
    )
  }

  return (
    <Suspense>
      <BalancerPoolDesktop show={showPool} closePool={closePool} />
    </Suspense>
  )
}

export default dynamic(() => Promise.resolve(BalancerPool), { ssr: false })
