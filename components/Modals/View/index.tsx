import dynamic from 'next/dynamic'

import { ModalType } from 'config/constants'
import { assertUnreachable } from 'utils/assertUnreachable'

const ApproveModal = dynamic(() => import('./ApproveModal'), {
  suspense: true,
})
const ClaimModal = dynamic(() => import('./ClaimModal'), {
  suspense: true,
})
const ConnectModal = dynamic(() => import('./ConnectModal'), {
  suspense: true,
})
const CooldownModal = dynamic(() => import('./CooldownModal'), {
  suspense: true,
})
const JoinModal = dynamic(() => import('./JoinModal'), {
  suspense: true,
})
const ExitModal = dynamic(() => import('./ExitModal'), {
  suspense: true,
})
const RevenueModal = dynamic(() => import('./RevenueModal'), {
  suspense: true,
})
const StakeModal = dynamic(() => import('./StakeModal'), {
  suspense: true,
})
const SwitchNetworkModal = dynamic(() => import('./SwitchNetworkModal'), {
  suspense: true,
})
const UnstakeModal = dynamic(() => import('./UnstakeModal'), {
  suspense: true,
})

type ModalViewProps = {
  modal: Modal
}

export default function ModalView({ modal }: ModalViewProps) {
  return renderModal(modal)
}

function renderModal(modal: Modal) {
  const { type, props } = modal

  switch (type) {
    case ModalType.Approve:
      return <ApproveModal {...props} />
    case ModalType.Claim:
      return <ClaimModal />
    case ModalType.Connect:
      return <ConnectModal />
    case ModalType.Cooldown:
      return <CooldownModal />
    case ModalType.Join:
      return <JoinModal {...props} />
    case ModalType.Exit:
      return <ExitModal {...props} />
    case ModalType.Revenue:
      return <RevenueModal />
    case ModalType.Stake:
      return <StakeModal {...props} />
    case ModalType.SwitchNetwork:
      return <SwitchNetworkModal />
    case ModalType.Unstake:
      return <UnstakeModal />
    default:
      assertUnreachable(modal.type)
  }
}
