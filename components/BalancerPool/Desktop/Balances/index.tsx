import { useAuth, useConnect, useStaking } from 'hooks'

import { StyledBalancerPoolBalances } from './styled'
import Button from 'components/Button'
import Suspense from 'components/Suspense'
import TokenIcon from 'components/TokenIcon'
import Content from './Content'

function BalancerPoolBalances() {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()
  const { lpToken } = useStaking()

  return (
    <StyledBalancerPoolBalances layout>
      <div className="balancesHeader">
        <TokenIcon address={lpToken?.address} $size={48} />

        <h2 className="title">{lpToken?.name}</h2>

        {!isConnected && (
          <Button
            className="connectButton"
            type="button"
            onClick={openConnectModal}
            $size="lg"
          >
            Connect wallet
          </Button>
        )}
      </div>

      {!!isConnected && (
        <Suspense>
          <Content />
        </Suspense>
      )}
    </StyledBalancerPoolBalances>
  )
}

export default BalancerPoolBalances
