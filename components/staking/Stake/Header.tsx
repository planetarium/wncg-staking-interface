import { StyledStakeHeader } from './styled'

export default function StakeHeader() {
  return (
    <StyledStakeHeader>
      <h1 className="title">
        Stake <br className="mobileOnly" />
        <br className="afterLaptop" />
        LP tokens
        <br />
        &amp; Get rewards!
      </h1>
    </StyledStakeHeader>
  )
}
