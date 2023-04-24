import Link from 'next/link'

import { StyledRootGnb } from './styled'

export default function RootGnb() {
  return (
    <StyledRootGnb>
      <h1 className="logo">
        <Link href="/">Staking Nine Chronicles Gold</Link>
      </h1>
    </StyledRootGnb>
  )
}
