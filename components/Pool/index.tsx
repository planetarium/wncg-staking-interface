import { useAtom } from 'jotai'

import { showPoolAtom } from 'states/ui'
import { useResponsive } from 'hooks'

import PoolDesktop from './Desktop'
import PoolMobile from './Mobile'

export default function Pool() {
  const { isMobile } = useResponsive()

  const [showPool, setShowPool] = useAtom(showPoolAtom)

  function closePool() {
    setShowPool(false)
  }

  if (isMobile) {
    return <PoolMobile show={showPool} closePool={closePool} />
  }

  return <PoolDesktop show={showPool} closePool={closePool} />
}
