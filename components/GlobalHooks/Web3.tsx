import { memo } from 'react'

import { useAccount, useNetwork } from 'hooks'

function Web3Hook() {
  useAccount()
  useNetwork()

  return null
}

export default memo(Web3Hook)
