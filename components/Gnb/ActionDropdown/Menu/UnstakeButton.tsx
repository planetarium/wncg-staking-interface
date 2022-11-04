import { motion } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { fadeIn } from 'constants/motionVariants'
import { useModal, useStakedBalance } from 'hooks'

import Button from 'components/Button'

type ActionDropdownMenuUnstakeButtonProps = {
  close(): void
}

function ActionDropdownMenuUnstakeButton({
  close,
}: ActionDropdownMenuUnstakeButtonProps) {
  const { addModal } = useModal()
  const { hasStakedBalance } = useStakedBalance()

  function unstake() {
    addModal({
      category: ModalCategory.Cooldown,
    })
    close()
  }

  return (
    <motion.div
      className="unstakePeriod"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
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
