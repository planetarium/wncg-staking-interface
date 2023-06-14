import { memo } from 'react'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { getNetworkLabel } from 'utils/getNetworkLabel'
import { useChain, useSwitchNetwork } from 'hooks'

import { StyledAlertContent } from './styled'
import Icon from 'components/Icon'

function NetworkAlert() {
  const { switchNetwork } = useSwitchNetwork()
  const { chainId } = useChain()

  return (
    <StyledAlertContent {...EXIT_MOTION} variants={ANIMATION_MAP.slideInDown}>
      <Icon icon="warning" $size={24} />
      <h1 className="desc">Please switch to {getNetworkLabel(chainId)}</h1>

      <button className="switchButton" type="button" onClick={switchNetwork}>
        Switch network
      </button>
    </StyledAlertContent>
  )
}

export default memo(NetworkAlert)
