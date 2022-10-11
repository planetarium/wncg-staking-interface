import { memo } from 'react'
import styled from 'styled-components'
import type { UseFormRegister } from 'react-hook-form'

import { usdCountUpOption } from 'constants/countUp'
import { getTokenSymbol } from 'utils/token'

import { CountUp } from 'components/CountUp'
import { NumberFormat } from 'components/NumberFormat'
import { TokenIcon } from 'components/TokenIcon'

const StyledRewardCardProps = styled.label`
  display: block;
  color: white;
  background-color: #000;
  border: 1px solid white;
  border-radius: 8px;

  &:has(input:checked) {
    background-color: yellow;
  }
`

type RewardCardProps = {
  address: string
  fiatValue: number
  register: UseFormRegister<{ tokensToClaim: string[] }>
  reward: string
}

function RewardCard({ address, fiatValue, reward, register }: RewardCardProps) {
  const id = `rewardCard:${address}`
  const symbol = getTokenSymbol(address)

  return (
    <StyledRewardCardProps htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        defaultChecked
        value={address}
        {...register('tokensToClaim')}
      />
      <TokenIcon symbol={symbol} />
      <NumberFormat value={reward} decimalScale={18} />
      <CountUp {...usdCountUpOption} end={fiatValue} />
    </StyledRewardCardProps>
  )
}

export default memo(RewardCard)
