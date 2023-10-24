import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import dynamic from 'next/dynamic'

import { StyledStakingDashboard } from './styled'
import Image from 'components/Image'
import Apr from './Apr'
import Fallback from './Fallback'
import Loading from './Loading'

function StakingDashboard() {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <StyledStakingDashboard>
      <div className="imageContainer">
        <Image
          className="image"
          src="/wncg-3d.webp"
          alt="Wrapped nine chronicles gold"
          priority
        />
      </div>

      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Fallback refetch={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<Loading />}>
          <Apr />
        </Suspense>
      </ErrorBoundary>
    </StyledStakingDashboard>
  )
}

export default dynamic(() => Promise.resolve(StakingDashboard), { ssr: false })
