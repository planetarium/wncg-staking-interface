import { memo, useCallback, useRef } from 'react'
import { useMount, useUnmount } from 'react-use'

import { slideInDown } from 'constants/motionVariants'

import { StyledActionDropdownMenu } from './styled'
import StakedBalance from './StakedBalance'
import AvailableBalance from './AvailableBalance'

type ActionDropdownMenuProps = {
  close(): void
}

function ActionDropdownMenu({ close }: ActionDropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        close()
        window.removeEventListener('click', closeOnBlur)
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
      <StakedBalance close={close} />
      <AvailableBalance close={close} />
    </StyledActionDropdownMenu>
  )
}

export default memo(ActionDropdownMenu)
