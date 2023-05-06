import {
  forwardRef,
  ForwardedRef,
  MouseEvent,
  useRef,
  PropsWithChildren,
  useMemo,
} from 'react'
import { useMachine } from '@xstate/react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

import { EXIT_MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { useAuth, useResponsive } from 'hooks'
import { txButtonMachine } from './stateMachine'

import { StyledTxButton } from './styled'
import ConnectorIcon from 'components/ConnectorIcon'
import Lottie from 'components/Lottie'

type TxButtonProps = {
  onClick?(): Promise<Hash | void>
  className?: string
  disabled?: boolean
  hash?: Hash
  $size?: ButtonSize
} & PropsWithChildren

function TxButton(
  {
    children,
    onClick,
    className,
    disabled: _disabled,
    hash,
    $size = 'md',
  }: TxButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const stateMachine = useRef(txButtonMachine)

  const { connector } = useAuth()
  const { isMobile } = useResponsive()

  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
    },
  })

  const isLoading = state.value === 'pending' || state.value === 'called'
  const disabled = !!hash || _disabled || state.value === 'pending'

  async function handleClick(e: MouseEvent) {
    e.stopPropagation()
    if (disabled || isLoading) return

    send('NEXT')

    try {
      const hash = await onClick?.()
      if (hash) send('NEXT')
      else send('ROLLBACK')
    } catch (error: any) {
      send('ROLLBACK')
    }
  }

  const label = useMemo(() => {
    if (!isLoading) return children
    return isMobile ? `Ready to confirm` : `Ready to confirm in your wallet`
  }, [children, isLoading, isMobile])

  const iconSize = $size === 'sm' ? 16 : 32

  return (
    <StyledTxButton
      className={clsx('txButton', className)}
      ref={ref}
      onClick={handleClick}
      disabled={disabled}
      $variant="primary"
      $contain={false}
      $size={$size}
    >
      <>
        <AnimatePresence>
          {isLoading && (
            <motion.div className="leftIcon" {...EXIT_MOTION} variants={fadeIn}>
              <Lottie animationData="loading" />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="label">{label}</span>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="rightIcon"
              {...EXIT_MOTION}
              variants={fadeIn}
            >
              <ConnectorIcon
                icon={connector?.id as ConnectorIconType}
                $size={iconSize}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </StyledTxButton>
  )
}

export default forwardRef(TxButton)
