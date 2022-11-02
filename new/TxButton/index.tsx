import { forwardRef } from 'react'
import type { ForwardedRef, MouseEvent, ReactNode } from 'react'
import { useMachine } from '@xstate/react'

import { txButtonMachine } from './stateMachine'
import { useAccount } from 'hooks'

import Button from 'new/Button'
import type { ConnectorIconType } from 'new/ConnectorIcon'
import type { ButtonSize } from 'new/Button/styled'

type TxButtonProps = {
  children: ReactNode
  onClick(): Promise<string | void>
  disabled?: boolean
  isPending?: boolean
  $size?: ButtonSize
}

function TxButton(
  {
    children,
    onClick,
    disabled: _disabled,
    isPending = false,
    $size = 'lg',
  }: TxButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const [state, send] = useMachine(txButtonMachine, {
    context: {
      isPending,
    },
  })

  const { connector } = useAccount()

  async function handleClick(e: MouseEvent) {
    e.stopPropagation()
    if (disabled) return

    send('CALL')

    try {
      await onClick()
      send('CONFIRM')
    } catch (error: any) {
      if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') {
        send('REJECT')
        return
      }
    }
  }

  const isLoading = ['called', 'pending'].includes(state.value as string)
  const disabled = _disabled || state.value === 'pending'
  const label = isLoading ? `Ready to confirm in your wallet` : children
  const leftIcon = isLoading ? 'loading' : undefined
  const rightIcon = isLoading ? (connector?.id as ConnectorIconType) : undefined

  return (
    <Button
      ref={ref}
      onClick={handleClick}
      disabled={disabled}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      $size={$size}
    >
      <>{label}</>
    </Button>
  )
}

export default forwardRef(TxButton)
