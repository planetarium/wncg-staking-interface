import { memo } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { useAuth } from 'hooks'

import { StyledStakingStake } from './styled'
import Suspense from 'components/Suspense'
import Connect from './Connect'
import Fallback from './Fallback'
import Header from './Header'

const Form = dynamic(() => import('./Form'), { ssr: false })
const JoinButton = dynamic(() => import('./JoinButton'), { ssr: false })

function StakingStake() {
  const { isConnected } = useAuth()

  return (
    <StyledStakingStake>
      <Header />

      <motion.div
        {...MOTION}
        className="stakeGroup"
        variants={ANIMATION_MAP.fadeIn}
      >
        {isConnected === true && (
          <Suspense fallback={<Fallback />}>
            <Form />
          </Suspense>
        )}

        {isConnected === false && <Connect />}

        <JoinButton />
      </motion.div>
    </StyledStakingStake>
  )
}

export default memo(StakingStake)
