import { memo } from 'react'
import dynamic from 'next/dynamic'

import { useFetchUserData } from 'hooks/queries'

import { StyledRevenueModal } from './styled'
import Fallback from 'components/ExpectedRevenue/Fallback'
import Icon from 'components/Icon'
import { CloseButton } from 'components/Modals/shared'
import Suspense from 'components/Suspense'

const ExpectedRevenue = dynamic(() => import('components/ExpectedRevenue'), {
  ssr: false,
})

function RevenueModal() {
  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  return (
    <StyledRevenueModal>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="subtitle">
            <Icon icon="time" $size={24} />
            Estimated earnings
          </h2>
        </div>

        <CloseButton />
      </header>

      <div className="container">
        <div className="modalContent">
          <p className="desc">
            These are expected rewards in case the current APR persists for the
            selected time period. APR can fluctuate with several factors
            including staking pool size and token price. The numbers are
            suggested for the ease of understanding, and are not guaranteed.
          </p>

          <Suspense fallback={<Fallback />}>
            <ExpectedRevenue amount={stakedTokenBalance} />
          </Suspense>
        </div>
      </div>
    </StyledRevenueModal>
  )
}

export default memo(RevenueModal)
