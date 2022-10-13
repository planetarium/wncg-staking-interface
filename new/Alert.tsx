import { memo } from 'react'

import { ModalCategory } from 'states/ui'
import { networkChainId, networkNameFor } from 'utils/network'
import { useModal } from 'hooks'

import { StyledAlert } from './styled'
import SvgIcon from './SvgIcon'

export const ALERT_HEIGHT = 56

const motionVariants = {
  initial: {
    y: ALERT_HEIGHT * -1,
  },
  animate: {
    y: 0,
  },
  exit: {
    y: ALERT_HEIGHT * -1,
  },
}

type AlertProps = {
  error: 'networkMismatch' | 'invalidPrice'
}

function Alert({ error }: AlertProps) {
  const { addModal } = useModal()
  const isNetworkError = error === 'networkMismatch'

  const message = parseAlertMsg(error)

  function switchNetwork() {
    addModal({
      category: ModalCategory.SwitchNetwork,
    })
  }

  function handleClick() {
    if (isNetworkError) return
    window?.location.reload()
  }

  return (
    <StyledAlert
      initial="initial"
      animate="animate"
      exit="exit"
      variants={motionVariants}
      transition={{ duration: 0.5, stiffness: 50 }}
      onClick={handleClick}
      role="alert"
    >
      <SvgIcon icon="warning" ariaHidden />
      <h2>{message}</h2>

      {isNetworkError && (
        <button className="switchButton" type="button" onClick={switchNetwork}>
          Switch network
        </button>
      )}
    </StyledAlert>
  )
}

export default memo(Alert)

function parseAlertMsg(error: string) {
  if (error === 'networkMismatch')
    return `Please switch to ${networkNameFor(networkChainId)}`
  return 'Token price estimation might be incorrect because of connection issue with Coingecko.'
}
