export const modalDesktopVariants = {
  initial: {
    opacity: 0,
    x: '-50%',
    y: '-48%',
  },
  animate: {
    opacity: 1,
    x: '-50%',
    y: '-50%',
    transition: {
      duration: 0.3,
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: '-50%',
    y: '-48%',
    transition: {
      duration: 0.3,
    },
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

export const modalOverlayVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      delay: 0.3,
    },
  },
}

export const modalTransition = {
  duration: 0.4,
}
