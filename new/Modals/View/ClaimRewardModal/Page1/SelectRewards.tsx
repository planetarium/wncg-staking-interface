import { memo } from 'react'
import { UseFormRegister } from 'react-hook-form'

import { usdCountUpOption } from 'constants/countUp'
import { getTokenSymbol } from 'utils/token'
import { useRewards } from 'hooks'
import { useStaking } from 'hooks/contracts'

import { ClaimRewardModalPage1SelectRewards } from './styled'
import CountUp from 'new/CountUp'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'
import TokenIcon from 'new/TokenIcon'

type SelectRewardsProps = {
  register: UseFormRegister<{ tokensToClaim: string[] }>
  isPending?: boolean
}

function SelectRewards({ register, isPending = false }: SelectRewardsProps) {
  const { rewards, rewardsInFiatValue } = useRewards()
  const { rewardTokensList } = useStaking()

  return (
    <ClaimRewardModalPage1SelectRewards
      className="selectRewards"
      $disabled={isPending}
    >
      {rewardTokensList.map((address, i) => {
        const id = `rewardCard:${address}`
        const symbol = getTokenSymbol(address)
        const amount = rewards[i]
        const fiatValue = rewardsInFiatValue[i]

        return (
          <label
            className="rewardItem"
            key={`claimReward:${address}`}
            htmlFor={id}
            aria-label={`Select ${symbol} reward`}
          >
            <input
              id={id}
              className="input"
              type="checkbox"
              defaultChecked
              value={address}
              disabled={isPending}
              {...register('tokensToClaim')}
            />
            <div className="rewardToken">
              <TokenIcon address={address} $size={24} />
              <strong>{symbol}</strong>
            </div>

            <dl>
              <dt className="hidden">Earned {symbol} reward</dt>
              <dd className="amount">
                <NumberFormat value={amount} decimals={8} prefix="+ " />
              </dd>
              <dt className="hidden">Earned {symbol} reward in USD</dt>
              <dd className="fiatValue">
                <SvgIcon icon="approximate" $size={24} />
                <CountUp {...usdCountUpOption} end={fiatValue} />
              </dd>
            </dl>

            <SvgIcon className="checkIcon" icon="checkLarge" $size={24} />
          </label>
        )
      })}
    </ClaimRewardModalPage1SelectRewards>
  )
}

export default memo(SelectRewards)
