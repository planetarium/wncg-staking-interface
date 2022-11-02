import { memo, useCallback, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useMount, useUnmount } from 'react-use'

import { ModalCategory } from 'states/ui'
import { slideInDown } from 'constants/motionVariants'
import { renderStrong } from 'utils/numberFormat'
import { getTokenSymbol } from 'utils/token'
import { useModal, useRewards } from 'hooks'

import { StyledActionDropdownMenu, StyledActionDropdownRewards } from './styled'
import AvailableBalance from 'new/Balances/AvailableBalance'
import StakedBalance from 'new/Balances/StakedBalance'
import Button from 'new/Button'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type ActionDropdownMenuProps = {
  close(): void
}

function ActionDropdownMenu({ close }: ActionDropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { addModal } = useModal()
  const { rewards, rewardTokensList, rewardsInFiatValue } = useRewards()

  function toggleRewards(e: ReactMouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setOpen((prev) => !prev)
  }

  function claim() {
    addModal({
      category: ModalCategory.ClaimReward,
    })
    close()
  }

  function withdraw() {
    addModal({
      category: ModalCategory.Withdraw,
    })
    close()
  }

  function exit() {
    addModal({
      category: ModalCategory.Exit,
    })
    close()
  }

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        close()
      }
    },
    [close]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur)
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })

  return (
    <StyledActionDropdownMenu
      className="actionDropdownMenu"
      ref={menuRef}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideInDown}
      aria-labelledby="actionDropdown"
      aria-orientation="vertical"
      role="menu"
    >
      <h3 className="hidden">Staking wallet</h3>

      <StakedBalance>
        <div className="buttonGroup">
          <StyledActionDropdownRewards className="rewards" $open={open}>
            <button
              id="actionDropdown:rewards:toggle"
              className="toggleButton"
              onClick={toggleRewards}
              aria-controls="actionDropdown:rewards"
            >
              Earned <SvgIcon icon="chevronRight" $size={16} />
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
                          prefix="+ "
                          decimalScale={18}
                          renderText={renderStrong}
                        />

                        <span className="usd">
                          <SvgIcon icon="approximate" $size={16} />
                          <NumberFormat
                            value={fiatValue}
                            decimals={2}
                            prefix="($"
                            suffix=")"
                          />
                        </span>
                      </dd>
                    </div>
                  )
                })}
              </dl>
              <Button onClick={claim} $variant="tertiary" $size="sm">
                Claim rewards
              </Button>
            </div>
          </StyledActionDropdownRewards>

          <Button onClick={withdraw} $variant="secondary" $size="md">
            Withdraw
          </Button>
        </div>
      </StakedBalance>

      <AvailableBalance>
        <Button onClick={exit} $variant="secondary" $size="md">
          Exit pool
        </Button>
      </AvailableBalance>
    </StyledActionDropdownMenu>
  )
}

export default memo(ActionDropdownMenu)
