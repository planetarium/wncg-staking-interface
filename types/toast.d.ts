type ToastType = 'success' | 'error' | 'info'

type ToastMessages = {
  success?: string
  error?: string
  info?: string
}
type ToastContent = {
  title: string
  messages: ToastMessages
}
