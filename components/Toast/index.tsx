import { useEffect } from 'react'
import { toast as toastify } from 'react-toastify'
import { useAtomValue } from 'jotai'

import { hasModalInViewAtom } from 'states/ui'
import { ToastType } from 'config/constants'
import { assertUnreachable } from 'utils/assertUnreachable'

import ApproveToast from './ApproveToast'
import ClaimToast from './ClaimToast'
import CooldownToast from './CooldownToast'
import ExitToast from './ExitToast'
import HarvestToast from './HarvestToast'
import JoinToast from './JoinToast'
import StakeToast from './StakeToast'
import UnstakeToast from './UnstakeToast'

export default function Toast(toast: Toast<any>) {
  return renderToast(toast)
}

function renderToast({ type, props }: Toast<any>) {
  switch (type) {
    case ToastType.Approve:
      return <ApproveToast {...props} />
    case ToastType.Claim:
      return <ClaimToast {...props} />
    case ToastType.Cooldown:
      return <CooldownToast {...props} />
    case ToastType.Exit:
      return <ExitToast {...props} />
    case ToastType.Harvest:
      return <HarvestToast {...props} />
    case ToastType.Join:
      return <JoinToast {...props} />
    case ToastType.Stake:
      return <StakeToast {...props} />
    case ToastType.Unstake:
      return <UnstakeToast {...props} />

    default:
      assertUnreachable(type)
  }
}
