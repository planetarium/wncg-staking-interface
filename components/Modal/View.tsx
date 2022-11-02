import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import styles from './style.module.scss'

import { Modal, ModalCategory } from 'states/ui'
import { assertUnreachable } from 'utils/assertion'
import { overlayVariants } from './constants'

const ExitPreviewModal = dynamic(() => import('./PoolModals/ExitPreviewModal'))
const JoinPreviewModal = dynamic(() => import('./PoolModals/JoinPreviewModal'))
const ClaimRewardModal = dynamic(() => import('./ClaimRewardModal'))
const ConnectModal = dynamic(() => import('./ConnectModal'))
const MetaMaskGuideModal = dynamic(() => import('./MetaMaskGuideModal'))
const StakeWarningModal = dynamic(() => import('./StakeWarningModal'))
const WithdrawPreviewModal = dynamic(() => import('./WithdrawPreviewModal'))

type ModalViewProps = {
  modal: Modal
}

export function ModalView({ modal }: ModalViewProps) {
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
      <aside className={styles.modalWrapper}>{renderModal(modal)}</aside>
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
