import { useRouter } from 'next/router'

import RootGnb from './Root'
import MainGnb from './Main'

export default function Gnb() {
  const { pathname } = useRouter()
  const isRootPage = pathname === '/'

  if (isRootPage) return <RootGnb />
  return <MainGnb />
}
