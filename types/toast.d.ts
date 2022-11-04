type ToastType = 'success' | 'error' | 'info'

type ToastMessages = Record<ToastType, string>
type ToastContent = {
  title: string
  messages: ToastMessages
}
