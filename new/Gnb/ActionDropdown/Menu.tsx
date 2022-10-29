import { memo, useCallback, useRef } from 'react'
import { useMount, useUnmount } from 'react-use'

import { ModalCategory } from 'states/ui'
import { slideInDown } from 'constants/motionVariants'
import { useModal } from 'hooks'

import { StyledActionDropdownMenu } from './styled'
import AvailableBalance from 'new/Balances/AvailableBalance'
import StakedBalance from 'new/Balances/StakedBalance'
import Button from 'new/Button'
import SvgIcon from 'new/SvgIcon'

type ActionDropdownMenuProps = {
  close(): void
}

function ActionDropdownMenu({ close }: ActionDropdownMenuProps) {
  const { addModal } = useModal()
  const menuRef = useRef<HTMLDivElement>(null)

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
    >
      <StakedBalance>
        <div className="buttonGroup">
          <button className="earnButton">
            Earned <SvgIcon icon="chevronRight" $size={16} />
          </button>

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
