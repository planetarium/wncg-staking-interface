import { useNetwork } from 'wagmi'
import { AnimatePresence } from 'framer-motion'

import { useChain } from 'hooks'
import NetworkAlert from './NetworkAlert'

import { StyledAlerts } from './styled'

export default function Alerts() {
  const { chainId } = useChain()
  const { chain } = useNetwork()

  const showAlert = !!chain?.id && chain?.id !== chainId

  return (
    <StyledAlerts role="alert" layout $enabled={showAlert}>
      <AnimatePresence>{showAlert && <NetworkAlert />}</AnimatePresence>
    </StyledAlerts>
  )
}
