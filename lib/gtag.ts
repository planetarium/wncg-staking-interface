type GaEventParams = {
  name: string
  params?: Record<string, any>
}

export const gaEvent = ({ name, params = {} }: GaEventParams) => {
  window?.gtag?.('event', name, params)
}
