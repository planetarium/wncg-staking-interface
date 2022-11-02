import { memo, MouseEvent, useState } from 'react'

import { ModalCategory } from 'states/ui'
import { bnum, hasAmounts } from 'utils/num'
import { renderStrong } from 'utils/numberFormat'
import { getTokenSymbol } from 'utils/token'
import { useModal, useRewards } from 'hooks'

import { StyledActionDropdownRewards } from './styled'
import Button from 'new/Button'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

function ActionDropdownRewards() {
  const [open, setOpen] = useState(false)

  const { addModal } = useModal()
  const { rewards, rewardTokensList, rewardsInFiatValue } = useRewards()

  const hasRewardsToClaim = hasAmounts(rewards)

  function toggleRewards(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setOpen((prev) => !prev)
  }

  function claim() {
    addModal({
      category: ModalCategory.ClaimReward,
    })
    close()
  }

  return (
    <StyledActionDropdownRewards className="actionDropdownRewards" $open={open}>
      <button
        id="actionDropdown:rewards:toggle"
        className="toggleButton"
        onClick={toggleRewards}
        aria-controls="actionDropdown:rewards"
      >
        Earned <SvgIcon icon="chevronRight" />
      </button>

      <div
        id="actionDropdown:rewards"
        className="content"
        aria-labelledby="actionDropdown:rewards:toggle"
        role="menu"
      >
        <dl className="rewardList">
          {rewards.map((amount, i) => {
            const address = rewardTokensList[i]
            const symbol = getTokenSymbol(address)
            const fiatValue = rewardsInFiatValue[i]
            const hasAmount = bnum(amount).gt(0)

            return (
              <div
                className="rewardItem"
                key={`actionDropdown:reward:${address}`}
                role="menuitem"
              >
                <dt>{symbol}</dt>
                <dd className="amount">
                  <NumberFormat
                    value={amount}
                    prefix={hasAmount ? '+ ' : undefined}
                    decimalScale={18}
                    renderText={renderStrong}
                  />

                  {hasAmount && (
                    <span className="usd">
                      <SvgIcon icon="approximate" />
                      <NumberFormat
                        value={fiatValue}
                        decimals={2}
                        prefix="($"
                        suffix=")"
                      />
                    </span>
                  )}
                </dd>
              </div>
            )
          })}
        </dl>

        {hasRewardsToClaim && (
          <Button
            className="claimButton"
            onClick={claim}
            $variant="tertiary"
            $size="sm"
          >
            Claim rewards
          </Button>
        )}
      </div>
    </StyledActionDropdownRewards>
  )
}

export default memo(ActionDropdownRewards)
