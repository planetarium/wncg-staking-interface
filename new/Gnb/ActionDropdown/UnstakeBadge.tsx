import { memo } from 'react'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { isUnstakeWindowAtom, isWithdrawWindowAtom } from 'states/user'
import { pop } from 'constants/motionVariants'

import { StyledActionDropdownUnstakeBadge } from './styled'
import SvgIcon from 'new/SvgIcon'

function ActionDropdownUnstakeBadge() {
  const isUnstakeWindow = useAtomValue(isUnstakeWindowAtom)
  const isWithdrawWindow = useAtomValue(isWithdrawWindowAtom)

  return (
    <AnimatePresence>
      {isUnstakeWindow && (
        <StyledActionDropdownUnstakeBadge
          className="unstakeBadge"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pop}
          $active={isWithdrawWindow}
        >
          <SvgIcon className="unlock" icon="unlock" />
          <SvgIcon className="lock" icon="lock" />
        </StyledActionDropdownUnstakeBadge>
      )}
    </AnimatePresence>
  )
}

export default memo(ActionDropdownUnstakeBadge)
