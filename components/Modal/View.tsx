import { useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import { motion } from 'framer-motion'
import styles from './style.module.scss'

import { Modal, ModalCategory } from 'app/states/modal'
import { assertUnreachable } from 'utils/assertion'
import { useModal } from 'hooks'
import { modalVariants, overlayVariants } from './constants'

import { ExitPreviewModal } from './PoolModals/ExitPreviewModal'
import { JoinPreviewModal } from './PoolModals/JoinPreviewModal'
import { ClaimRewardModal } from './ClaimRewardModal'
import { ConnectModal } from './ConnectModal'
import { MetaMaskGuideModal } from './MetaMaskGuideModal'
import { StakeWarningModal } from './StakeWarningModal'
import { WithdrawPreviewModal } from './WithdrawPreviewModal'

type ModalViewProps = {
  modal: Modal
}

export function ModalView({ modal }: ModalViewProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { removeModal } = useModal()

  function closeOnBlur(e: MouseEvent) {
    if (!modalRef?.current?.contains(e.target as Node)) {
      removeModal(modal.category)
    }
  }

  useMount(() => {
    window.addEventListener('click', closeOnBlur)
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })

  return (
    <motion.div
      className={styles.overlay}
      variants={overlayVariants}
      key={`${modal.category}.overlay`}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <motion.aside
        className={styles.modalWrapper}
        ref={modalRef}
        key={`${modal.category}.modal`}
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
      >
        {renderModal(modal)}
      </motion.aside>
    </motion.div>
  )
}

function renderModal(modal: Modal) {
  const { category, props } = modal

  switch (category) {
    case ModalCategory.ClaimReward:
      return <ClaimRewardModal {...props} />
    case ModalCategory.Connect:
      return <ConnectModal {...props} />
    case ModalCategory.Error:
      return <div {...props}>ErrorModal</div>
    case ModalCategory.ExitPreview:
      return <ExitPreviewModal {...props} />
    case ModalCategory.JoinPreview:
      return <JoinPreviewModal {...props} />
    case ModalCategory.MetaMaskGuide:
      return <MetaMaskGuideModal {...props} />
    case ModalCategory.StakeWarning:
      return <StakeWarningModal {...props} />
    case ModalCategory.WithdrawPreview:
      return <WithdrawPreviewModal {...props} />
    default:
      assertUnreachable(modal.category)
  }
}
