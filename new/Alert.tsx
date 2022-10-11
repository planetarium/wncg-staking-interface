import { memo } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

import { ModalCategory } from 'states/ui'
import { networkChainId, networkNameFor } from 'utils/network'
import { useModal } from 'hooks'

import { Icon } from 'components/Icon'

const motionVariants = {
  initial: {
    y: -56,
  },
  animate: {
    y: 0,
  },
  exit: {
    y: -56,
  },
}

const StyledAlert = styled(motion.aside)`
  position: fixed;
  top: 0;
  left: 0;
  flex-shrink: 0;
  width: 100%;
  height: 56px;
  color: #fff;
  line-height: 56px;
  text-align: center;
  background-color: red;
  cursor: pointer;

  svg {
    width: 15px;
    height: 15px;
  }
`

type AlertProps = {
  error: 'networkMismatch' | 'invalidPrice'
}

function Alert({ error }: AlertProps) {
  const { addModal } = useModal()

  const message = parseAlertMsg(error)

  function handleClick() {
    if (error === 'networkMismatch') {
      addModal({
        category: ModalCategory.SwitchNetwork,
      })
      return
    }

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
      <Icon id="alert" />
      <h2>{message}</h2>
    </StyledAlert>
  )
}

export default memo(Alert)

function parseAlertMsg(error: string) {
  if (error === 'networkMismatch')
    return `You must switch to ${networkNameFor(
      networkChainId
    )} to use this protocol.`
  return 'Token price estimation might be incorrect because of connection issue with Coingecko.'
}
