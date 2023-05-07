import { useMemo } from 'react'
import Link from 'next/link'

import { useResponsive } from 'hooks'

import { StyledDocsGnb } from './styled'
import Image from 'components/Image'

export default function DocsGnb() {
  const { bp } = useResponsive()

  const logoSrc = useMemo(() => {
    const breakpoint = bp === 'smLaptop' ? 'laptop' : bp
    return `/logo-staking-${breakpoint}.png`
  }, [bp])

  return (
    <StyledDocsGnb>
      <h1 className="logo">
        <Link href="/wncg">
          <Image src={logoSrc} alt="WNCG Staking" />
        </Link>
      </h1>
    </StyledDocsGnb>
  )
}
