import { memo, useRef } from 'react'
import { useAtomValue } from 'jotai'

import { isUnstakeWindowAtom } from 'states/account'
import { EXIT_MOTION } from 'config/motions'
import { dropdownTransition, slideInDown } from 'config/motionVariants'
import { useCloseOnBlur } from 'hooks'

import { StyledMyStakingWallet } from './styled'
import Suspense from 'components/Suspense'
import Balance from './Balance'
import Staking from './Staking'
import UnstakeWindow from './UnstakeWindow'

type MyStakingWalletProp = {
  closeWallet(): void
}

function MyStakingWallet({ closeWallet }: MyStakingWalletProp) {
  const ref = useRef<HTMLDivElement>(null)

  const showUnstakeWindow = useAtomValue(isUnstakeWindowAtom)

  useCloseOnBlur(ref, closeWallet)

  return (
    <StyledMyStakingWallet
      {...EXIT_MOTION}
      ref={ref}
      variants={slideInDown}
      transition={dropdownTransition}
    >
      <Staking closeWallet={closeWallet} />

      {showUnstakeWindow && (
        <Suspense>
          <UnstakeWindow closeWallet={closeWallet} />
        </Suspense>
      )}

      <span className="divider" />

      <Suspense>
        <Balance />
      </Suspense>
    </StyledMyStakingWallet>
  )
}

export default memo(MyStakingWallet)
