export const modalDesktopVariants = {
  initial: {
    x: '-50%',
    y: '-48%',
  },
  animate: {
    x: '-50%',
    y: '-50%',
    transition: {
      duration: 0.3,
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
    y: '100%',
  },
  animate: { y: 0 },
  exit: {
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
