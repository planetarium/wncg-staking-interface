import { useAuth, useStaking } from 'hooks'

import { StyledAddLiquidityPoolBalances } from './styled'
import Button from 'components/Button'
import Suspense from 'components/Suspense'
import TokenIcon from 'components/TokenIcon'
import Content from './Content'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function AddLiquidityPoolBalances() {
  const { isConnected } = useAuth()
  const { lpToken } = useStaking()

  return (
    <StyledAddLiquidityPoolBalances layout>
      <div className="balancesHeader">
        <TokenIcon address={lpToken?.address} $size={48} />

        <h2 className="title">{lpToken?.name}</h2>

        {!isConnected && (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                className="connectButton"
                type="button"
                onClick={openConnectModal}
                $size="lg"
              >
                Connect wallet
              </Button>
            )}
          </ConnectButton.Custom>
        )}
      </div>

      {!!isConnected && (
        <Suspense>
          <Content />
        </Suspense>
      )}
    </StyledAddLiquidityPoolBalances>
  )
}

export default AddLiquidityPoolBalances
