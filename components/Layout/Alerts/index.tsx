import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { currentChainIdAtom } from 'states/system'

import { StyledAlerts } from './styled'
import NetworkAlert from './NetworkAlert'
import { useChain } from 'hooks'

export default function Alerts() {
  const { chainId } = useChain()
  const currentChainId = useAtomValue(currentChainIdAtom)

  const invalidNetwork = currentChainId != null && currentChainId !== chainId

  const enabled = invalidNetwork

  return (
    <StyledAlerts role="alert" layout $enabled={enabled}>
      <AnimatePresence>{invalidNetwork && <NetworkAlert />}</AnimatePresence>
    </StyledAlerts>
  )
}
