import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai'

import { isMobileAtom, Modal, ModalCategory } from 'states/ui'
import { assertUnreachable } from 'utils/assertion'
import {
  modalDesktopVariants,
  modalMobileVariants,
  overlayVariants,
} from '../constants'

import { StyledModalContainer, StyledModalOverlay } from '../shared/styled'

const StakeModal = dynamic(() => import('new/staking/StakeModal'), {
  suspense: true,
})
const ClaimRewardModal = dynamic(() => import('./ClaimRewardModal'), {
  suspense: true,
})
const ConnectWalletModal = dynamic(() => import('./ConnectWalletModal'), {
  suspense: true,
})
const JoinModal = dynamic(() => import('new/Pool/Join/Modal'), {
  suspense: true,
})
const ExitModal = dynamic(() => import('./ExitModal'), {
  suspense: true,
})
const SwitchNetworkModal = dynamic(() => import('./SwitchNetworkModal'), {
  suspense: true,
})
const WithdrawModal = dynamic(() => import('./WithdrawModal'), {
  suspense: true,
})

type ModalViewProps = {
  modal: Modal
}

export function ModalView({ modal }: ModalViewProps) {
  const isMobile = useAtomValue(isMobileAtom)

  const variants = isMobile ? modalMobileVariants : modalDesktopVariants

  return (
    <StyledModalOverlay
      variants={overlayVariants}
      key={`${modal.category}.overlay`}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <StyledModalContainer
        key={`${modal.category}.modal`}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
      >
        {renderModal(modal)}
      </StyledModalContainer>
    </StyledModalOverlay>
  )
}

function renderModal(modal: Modal) {
  const { category, props } = modal

  switch (category) {
    case ModalCategory.ClaimReward:
      return <ClaimRewardModal />
    case ModalCategory.Connect:
      return <ConnectWalletModal />
    case ModalCategory.Join:
      return <JoinModal {...props} />
    case ModalCategory.Exit:
      return <ExitModal {...props} />
    case ModalCategory.Stake:
      return <StakeModal {...props} />
    case ModalCategory.SwitchNetwork:
      return <SwitchNetworkModal />
    case ModalCategory.Withdraw:
      return <WithdrawModal />
    default:
      assertUnreachable(modal.category)
  }
}
