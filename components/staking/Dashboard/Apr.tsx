import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import { isEthereum } from 'utils/isEthereum'
import { useChain, useFiat, useStaking } from 'hooks'
import { useFetchTotalStaked } from 'hooks/queries'

import { StyledStakingDashboardApr } from './styled'
import CountUp from 'components/CountUp'
import Suspense from 'components/Suspense'
import ApiItemLoading from './AprItemLoading'
import AprItemFallback from './AprItemFallback'
import BALApr from './BALApr'
import RewardTokenApr from './RewardTokenApr'

function StakingDashboardApr() {
  const { reset } = useQueryErrorResetBoundary()

  const { chainId } = useChain()
  const toFiat = useFiat()

  const { lpToken, rewardTokenAddresses, tokens } = useStaking()
  const rewardTokenSymbols = rewardTokenAddresses.map(
    (addr) => tokens[addr]?.symbol
  )

  const { data: totalStaked } = useFetchTotalStaked()

  const totalStakedInFiatValue = toFiat(totalStaked ?? '0', lpToken?.address)

  return (
    <StyledStakingDashboardApr className="aprList" suppressHydrationWarning>
      <div className="aprItem">
        <dt>Total Staked</dt>
        <dd className="colon">
          <CountUp value={totalStakedInFiatValue} type="fiat" abbr />
        </dd>
      </div>

      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <AprItemFallback
            symbol={rewardTokenSymbols[0]}
            refetch={resetErrorBoundary}
          />
        )}
      >
        <Suspense fallback={<ApiItemLoading label={rewardTokenSymbols[0]} />}>
          <RewardTokenApr totalStaked={totalStaked!} />
        </Suspense>
      </ErrorBoundary>

      {isEthereum(chainId) && (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <AprItemFallback symbol="BAL" refetch={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<ApiItemLoading label="BAL" $width={100} />}>
            <BALApr totalStaked={totalStaked!} />
          </Suspense>
        </ErrorBoundary>
      )}
    </StyledStakingDashboardApr>
  )
}

export default StakingDashboardApr
