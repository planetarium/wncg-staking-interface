import { StyledStakeModalPage0 } from './styled'
import Button from 'components/Button'
import { CloseButton } from 'components/Modals/shared'

type StakeModalPage0Props = {
  send: XstateSend
}

export default function StakeModalPage0({ send }: StakeModalPage0Props) {
  function goNext() {
    send('NEXT')
  }

  return (
    <StyledStakeModalPage0>
      <header className="modalHeader">
        <h2 className="title">
          Current cooldown will be extended if you stake more tokens. Do you
          still want to proceed?
        </h2>
        <p className="desc">
          Cooldown countdown is calculated proportionally with the token amounts
          already staked and the newly staked.
        </p>
        <CloseButton />
      </header>

      <footer className="modalFooter">
        <Button onClick={goNext} $size="md">
          Yes, please proceed
        </Button>
      </footer>
    </StyledStakeModalPage0>
  )
}
