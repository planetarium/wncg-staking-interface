import Link from 'next/link'
import { StyledDisclaimer } from './styled'

function Disclaimer() {
  return (
    <StyledDisclaimer>
      By connecting a wallet, you agree to Nine Chronicles Ltd&apos;s{' '}
      <Link href="/docs/terms" target="_blank" rel="noopener">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/docs/privacy" target="_blank" rel="noopener">
        Privacy Policy
      </Link>
      .
    </StyledDisclaimer>
  )
}

export default Disclaimer
