import { StyledStakeHeader } from './styled'

// FIXME: remove fx group?
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

      {/* <div className="effectGroup" aria-hidden>
        <span className="effect lightBlue large" />
        <span className="effect lightGray small" />
        <span className="effect purple large" />
      </div> */}
    </StyledStakeHeader>
  )
}
