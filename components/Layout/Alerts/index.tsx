import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { currentChainIdAtom } from 'states/system'
import config from 'config'

import { StyledAlerts } from './styled'
import NetworkAlert from './NetworkAlert'

export default function Alerts() {
  const currentChainId = useAtomValue(currentChainIdAtom)

  const invalidNetwork =
    currentChainId != null && currentChainId !== config.chainId

  const enabled = invalidNetwork

  return (
    <StyledAlerts role="alert" layout $enabled={enabled}>
      <AnimatePresence>{invalidNetwork && <NetworkAlert />}</AnimatePresence>
    </StyledAlerts>
  )
}
