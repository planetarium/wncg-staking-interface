import { useNetwork } from 'wagmi'
import { AnimatePresence } from 'framer-motion'

import { useChain } from 'hooks'

import { StyledAlerts } from './styled'
import NetworkAlert from './NetworkAlert'

export default function Alerts() {
  const { chainId } = useChain()
  const { chain } = useNetwork()

  const showAlert = chain?.id !== chainId

  return (
    <StyledAlerts role="alert" layout $enabled={showAlert}>
      <AnimatePresence>{showAlert && <NetworkAlert />}</AnimatePresence>
    </StyledAlerts>
  )
}
