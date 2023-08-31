import { useAuth } from 'hooks'

import { StyledAddLiquidityFormFooter } from './styled'
import Button from 'components/Button'
import { Checkout } from 'components/Modals/shared'

type AddLiquidityFormFooterProps = {
  amountsInFiatValueSum: string
  openAddLiquidity(): Promise<void>
  submitDisabled: boolean
  className?: string
}

export default function AddLiquidityFormFooter({
  className,
  amountsInFiatValueSum,
  openAddLiquidity,
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
        onClick={openAddLiquidity}
        disabled={submitDisabled}
        $size="lg"
      >
        Join pool, get Cake-LP
      </Button>
    </StyledAddLiquidityFormFooter>
  )
}
