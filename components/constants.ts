export const ALERT_HEIGHT = 56
export const GLOBAL_FOOTER_HEIGHT = 88

export const alertVariants = {
  initial: {
    y: ALERT_HEIGHT * -1,
  },
  animate: {
    y: 0,
  },
  exit: {
    y: ALERT_HEIGHT * -1,
  },
}

export const mainVariants = {
  initial: {
    y: 0,
  },
  animate: {
    y: ALERT_HEIGHT,
  },
  exit: {
    y: 0,
  },
}
