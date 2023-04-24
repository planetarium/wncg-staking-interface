import { StyledJoinFormFooter } from './styled'
import Button from 'components/Button'
import { Checkout } from 'components/Modals/shared'

type JoinFormFooterProps = {
  totalJoinFiatValue: string
  openJoin(): Promise<void>
  submitDisabled: boolean
  className?: string
}

export default function JoinFormFooter({
  className,
  totalJoinFiatValue,
  openJoin,
  submitDisabled,
}: JoinFormFooterProps) {
  return (
    <StyledJoinFormFooter className={className}>
      <Checkout amount={totalJoinFiatValue} message="Join pool" type="fiat" />
      <Button
        className="submitButton"
        onClick={openJoin}
        disabled={submitDisabled}
        $size="lg"
      >
        Join pool, get LP tokens
      </Button>
    </StyledJoinFormFooter>
  )
}
