import { darkTheme, Theme } from '@rainbow-me/rainbowkit'
import { merge } from 'lodash-es'

export const customTheme: Theme = merge(
  darkTheme({
    accentColor: 'var(--primary-500)',
    accentColorForeground: 'white',
    overlayBlur: 'large',
    borderRadius: 'large',
  }),
  {
    colors: {
      modalBackdrop: 'rgba(var(--realBlack-rgb), 0.8)',
      modalBackground: 'rgba(var(--gray-900-rgb),0.8)',
    },
  }
)
