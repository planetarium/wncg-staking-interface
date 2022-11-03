import { useAtomValue } from 'jotai'
import { motion } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { isCooldownWindowAtom, isWithdrawWindowAtom } from 'states/user'
import { slideInDown } from 'constants/motionVariants'
import { useModal, useStakedBalance } from 'hooks'

import Button from 'new/Button'

type ActionDropdownMenuUnstakeButtonProps = {
  close(): void
}

function ActionDropdownMenuUnstakeButton({
  close,
}: ActionDropdownMenuUnstakeButtonProps) {
  const { addModal } = useModal()
  const { hasStakedBalance } = useStakedBalance()

  const isCooldownWindow = useAtomValue(isCooldownWindowAtom)
  const isWithdrawWindow = useAtomValue(isWithdrawWindowAtom)

  function unstake() {
    let category: ModalCategory | null = null

    switch (true) {
      case isWithdrawWindow:
        category = ModalCategory.Withdraw
        break
      case !isCooldownWindow:
        category = ModalCategory.Cooldown
        break
      default:
        break
    }

    // addModal({
    //   category: ModalCategory.Cooldown,
    // })

    if (category) {
      addModal({
        category,
      })
    }
    close()
  }

  return (
    <motion.div
      className="unstakePeriod"
      //   initial="initial"
      animate="animate"
      exit="exit"
      variants={slideInDown}
    >
      <Button
        className="actionButton"
        onClick={unstake}
        disabled={!hasStakedBalance}
        $variant="secondary"
        $size="md"
      >
        Withdraw
      </Button>
    </motion.div>
  )
}

export default ActionDropdownMenuUnstakeButton
