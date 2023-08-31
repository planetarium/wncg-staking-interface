import dynamic from 'next/dynamic'
import { useNetwork } from 'wagmi'
import { AnimatePresence } from 'framer-motion'

import { useChain } from 'hooks'
import NetworkAlert from './NetworkAlert'

import { StyledAlerts } from './styled'

function Alerts() {
  const { chainId } = useChain()
  const { chain } = useNetwork()

  const showAlert = !!chain?.id && chain?.id !== chainId

  return (
    <StyledAlerts role="alert" layout $enabled={showAlert}>
      <AnimatePresence>{showAlert && <NetworkAlert />}</AnimatePresence>
    </StyledAlerts>
  )
}

export default dynamic(() => Promise.resolve(Alerts), { ssr: false })
