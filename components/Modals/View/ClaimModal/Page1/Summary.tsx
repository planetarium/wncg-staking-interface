import { useChain, useFiat, useStaking } from 'hooks'
import { bnum } from 'utils/bnum'
import { isEthereum } from 'utils/isEthereum'

import { StyledClaimModalPage1Summary } from './styled'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'

type ClaimModalPage1SummaryProps = {
  earnedTokenRewards: string[]
}

export default function ClaimModalPage1Summary({
  earnedTokenRewards,
}: ClaimModalPage1SummaryProps) {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { rewardTokenAddresses, tokens } = useStaking()

  const address = rewardTokenAddresses[0]
  const rewardAmount = earnedTokenRewards[0]
  const hasRewards = bnum(rewardAmount).gt(0)
  const fiatValue = toFiat(rewardAmount, address)

  if (isEthereum(chainId)) return null

  return (
    <StyledClaimModalPage1Summary className="reward">
      <dt>{tokens[address].symbol}</dt>
      <dd>
        <CountUp value={rewardAmount} decimals={8} />
        {hasRewards && <NumberFormat value={fiatValue} type="fiat" />}
      </dd>
    </StyledClaimModalPage1Summary>
  )
}
