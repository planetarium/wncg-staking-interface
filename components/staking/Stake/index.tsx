import { memo } from 'react'

import { useAuth } from 'hooks'

import { StyledStakingStake } from './styled'
import Suspense from 'components/Suspense'
import Connect from './Connect'
import Form from './Form'
import Header from './Header'
import JoinButton from './JoinButton'

function StakingStake() {
  const { isConnected } = useAuth()

  return (
    <StyledStakingStake>
      <Header />

      {isConnected === true && (
        <Suspense>
          <Form />
        </Suspense>
      )}

      {isConnected === false && <Connect />}

      <Suspense>
        <JoinButton />
      </Suspense>
    </StyledStakingStake>
  )
}

export default memo(StakingStake)
