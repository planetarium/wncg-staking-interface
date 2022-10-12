import { memo } from 'react'
import styled from 'styled-components'
import type { UseFormRegister } from 'react-hook-form'

import { usdCountUpOption } from 'constants/countUp'

import CountUp from 'new/CountUp'
import NumberFormat from 'new/NumberFormat'
import TokenIcon from 'new/TokenIcon'

const StyledRewardCardProps = styled.label`
  display: block;
  color: white;
  background-color: #000;
  border: 1px solid white;
  border-radius: 8px;

  &:has(input:checked) {
    color: black;
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

  return (
    <StyledRewardCardProps htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        defaultChecked
        value={address}
        {...register('tokensToClaim')}
      />
      <TokenIcon address={address} />
      <NumberFormat value={reward} />
      <CountUp {...usdCountUpOption} end={fiatValue} />
    </StyledRewardCardProps>
  )
}

export default memo(RewardCard)
