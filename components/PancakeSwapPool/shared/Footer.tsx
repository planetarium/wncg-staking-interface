import { useAuth } from 'hooks'

import { StyledAddLiquidityFormFooter } from './styled'
import Button from 'components/Button'
import { Checkout } from 'components/Modals/shared'

type AddLiquidityFormFooterProps = {
  amountsInFiatValueSum: string
  openJoin(): Promise<void>
  submitDisabled: boolean
  className?: string
}

export default function AddLiquidityFormFooter({
  className,
  amountsInFiatValueSum,
  openJoin,
  submitDisabled,
}: AddLiquidityFormFooterProps) {
  const { isConnected } = useAuth()

  return (
    <StyledAddLiquidityFormFooter
      className={className}
      $disabled={!isConnected}
    >
      <Checkout
        amount={amountsInFiatValueSum}
        message="Join pool"
        type="fiat"
      />
      <Button
        className="submitButton"
        onClick={openJoin}
        disabled={submitDisabled}
        $size="lg"
      >
        Join pool, get LP tokens
      </Button>
    </StyledAddLiquidityFormFooter>
  )
}
