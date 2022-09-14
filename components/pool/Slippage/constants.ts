export const menuVariants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
}

export const menuTransition = { ease: 'easeOut', duration: 0.25 }

export const SLIPPAGES = [0.5, 1, 2]
