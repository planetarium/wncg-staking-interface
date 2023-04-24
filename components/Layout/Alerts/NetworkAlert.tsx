import { memo } from 'react'

import config from 'config'
import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'config/motionVariants'
import { networkNameFor } from 'utils/networkNameFor'
import { useSwitchNetwork } from 'hooks'

import { StyledAlertContent } from './styled'
import Icon from 'components/Icon'

function NetworkAlert() {
  const { switchNetwork } = useSwitchNetwork()

  return (
    <StyledAlertContent {...EXIT_MOTION} variants={slideInDown}>
      <Icon icon="warning" $size={24} />
      <h1 className="desc">
        Please switch to {networkNameFor(config.chainId)}
      </h1>

      <button className="switchButton" type="button" onClick={switchNetwork}>
        Switch network
      </button>
    </StyledAlertContent>
  )
}

export default memo(NetworkAlert)
