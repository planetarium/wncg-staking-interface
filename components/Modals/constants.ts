export const modalDesktopVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: 20,
  },
}

export const modalMobileVariants = {
  initial: {
    opacity: 0.5,
    y: '100%',
  },
  animate: { opacity: 1, y: 0 },
  exit: {
    opacity: 0.5,
    y: '100%',
  },
}

export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
