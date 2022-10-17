import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useAccount } from 'hooks'

import { StyledPoolForm } from './styled'
import Header from './Header'

function PoolForm() {
  const { isConnected } = useAccount()

  return (
    <AnimatePresence>
      {isConnected && (
        <StyledPoolForm className="poolForm">
          <Header />
        </StyledPoolForm>
      )}
    </AnimatePresence>
  )
}

export default memo(PoolForm)
