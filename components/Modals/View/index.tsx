import dynamic from 'next/dynamic'
import { ErrorBoundary } from 'react-error-boundary'

import { ModalType } from 'config/constants'
import { assertUnreachable } from 'utils/assertUnreachable'
import { FailPage } from '../shared'

const ApproveModal = dynamic(() => import('./ApproveModal'), {
  ssr: false,
})
const AddLiquidityModal = dynamic(() => import('./AddLiquidityModal'), {
  ssr: false,
})
const ClaimModal = dynamic(() => import('./ClaimModal'), {
  ssr: false,
})
const ConnectModal = dynamic(() => import('./ConnectModal'), {
  ssr: false,
})
const CooldownModal = dynamic(() => import('./CooldownModal'), {
  ssr: false,
})
const JoinModal = dynamic(() => import('./JoinModal'), {
  ssr: false,
})
const ExitModal = dynamic(() => import('./ExitModal'), {
  ssr: false,
})
const RemoveLiquidityModal = dynamic(() => import('./RemoveLiquidityModal'), {
  ssr: false,
})
const RevenueModal = dynamic(() => import('./RevenueModal'), {
  ssr: false,
})
const StakeModal = dynamic(() => import('./StakeModal'), {
  ssr: false,
})
const SwitchNetworkModal = dynamic(() => import('./SwitchNetworkModal'), {
  ssr: false,
})
const UnstakeModal = dynamic(() => import('./UnstakeModal'), {
  ssr: false,
})

type ModalViewProps = {
  modal: Modal
}

export default function ModalView({ modal }: ModalViewProps) {
  return (
    <ErrorBoundary fallbackRender={() => <FailPage />}>
      {renderModal(modal)}
    </ErrorBoundary>
  )
}

function renderModal(modal: Modal) {
  const { type, props } = modal

  switch (type) {
    case ModalType.AddLiquidity:
      return <AddLiquidityModal {...props} />
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
    case ModalType.RemoveLiquidity:
      return <RemoveLiquidityModal />
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
