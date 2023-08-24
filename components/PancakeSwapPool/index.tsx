import dynamic from 'next/dynamic'
import { useAtom } from 'jotai'

import { showPoolAtom } from 'states/ui'
import { useResponsive } from 'hooks'

import PancakeSwapPoolDesktop from './Desktop'
import PancakeSwapPoolMobile from './Mobile'

function PancakeSwapPool() {
  const { isMobile } = useResponsive()

  const [showPool, setShowPool] = useAtom(showPoolAtom)

  function closePool() {
    setShowPool(false)
  }

  if (isMobile) {
    return <PancakeSwapPoolMobile show={showPool} closePool={closePool} />
  }

  return <PancakeSwapPoolDesktop show={showPool} closePool={closePool} />
}

export default dynamic(() => Promise.resolve(PancakeSwapPool), { ssr: false })
