import Button from 'new/Button'
import { StyledModalCompletedPage } from '../../shared/styled'

type ApproveModalPage2Props = {
  symbol: string
  tokenAddress: string
}

function ApproveModalPage2({ symbol, tokenAddress }: ApproveModalPage2Props) {
  return (
    <StyledModalCompletedPage>
      <header>
        <h2>Approval Completed!</h2>
      </header>
      <Button $size="lg">next step</Button>
    </StyledModalCompletedPage>
  )
}

export default ApproveModalPage2
