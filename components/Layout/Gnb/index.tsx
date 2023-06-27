import RootGnb from './Root'
import MainGnb from './Main'

type GnbProps = {
  isRootPage: boolean
}

export default function Gnb({ isRootPage }: GnbProps) {
  if (isRootPage) return <RootGnb />
  return <MainGnb />
}
