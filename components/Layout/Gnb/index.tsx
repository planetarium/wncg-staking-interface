import dynamic from 'next/dynamic'

import RootGnb from './Root'
import MainGnb from './Main'

type GnbProps = {
  isRootPage: boolean
}

function Gnb({ isRootPage }: GnbProps) {
  if (isRootPage) return <RootGnb />
  return <MainGnb />
}

export default dynamic(() => Promise.resolve(Gnb), { ssr: false })
