import { memo } from 'react'

import { useAccount } from 'hooks'

function Web3Hook() {
  useAccount()

  return null
}

export default memo(Web3Hook)
