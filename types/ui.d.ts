type Modal = {
  type: ModalType
  props?: any
}

type ToastProps<T> = {
  hash: Hash
} & T

type Toast<T> = {
  type: ToastType
  props: ToastProps<T>
}

type NumericValueType = 'token' | 'fiat' | 'percent'

type ButtonSize = import('components/Button/styled').ButtonSize
type ButtonVariant = import('components/Button/styled').ButtonVariant

type CheckboxSize = import('components/Checkbox/styled').CheckboxSize

type ConnectorIconType =
  import('components/ConnectorIcon/styled').ConnectorIconType

type CryptoIconType = import('components/CryptoIcon').CryptoIconType

type IconSize = import('components/Icon/styled').IconSize

type InputSize = import('components/Form/styled').InputSize

type UnstakeTimestamps = {
  cooldownEndsAt: number
  withdrawEndsAt: number
  cooldowns: number
}

type RadioSize = CheckboxSize

type ToastMessages = {
  success?: string
  error?: string
  info?: string
}
type ToastContent = {
  title: string
  messages: ToastMessages
}
