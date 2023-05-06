import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useResponsive } from 'hooks'

import { StyledRootGnb } from './styled'
import Image from 'components/Image'

export default function RootGnb() {
  const { bp } = useResponsive()
  const { reload } = useRouter()

  const logoSrc = useMemo(() => {
    const breakpoint = bp === 'smLaptop' ? 'laptop' : bp
    return `/logo-staking-main-${breakpoint}.png`
  }, [bp])

  return (
    <StyledRootGnb>
      <h1 className="logo">
        <Link href="/" onClick={reload}>
          <Image src={logoSrc} alt="" />
        </Link>
      </h1>
    </StyledRootGnb>
  )
}
