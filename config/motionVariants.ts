import type { Transition } from 'framer-motion'

export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

export const slideInDown = {
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

export const slideInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 20,
  },
}

export const slideInFromRight = {
  initial: {
    x: '100%',
  },
  animate: {
    x: 0,
  },
  exit: {
    x: '100%',
  },
}

export const appearInDown = {
  initial: {
    opacity: 0,
    y: '-100%',
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: '-100%',
  },
}

export const appearInUp = {
  initial: {
    opacity: 0,
    y: '100%',
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      stiffness: 20,
    },
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: {
      delay: 0.05,
      duration: 0.3,
      stiffness: 10,
    },
  },
}

export const popIn = {
  initial: {
    opacity: 0,
    scale: 0.2,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.2,
  },
}

export const popInCenter = {
  initial: {
    x: '-50%',
    y: '-50%',
    scale: 0,
  },
  animate: {
    x: '-50%',
    y: '-50%',
    scale: 1,
  },
  exit: {
    x: '-50%',
    y: '-50%',
    scale: 0,
  },
}

export const dropdownTransition: Transition = {
  duration: 0.25,
  stiffness: 50,
}

export const smoothTransition: Transition = {
  duration: 0.5,
  stiffness: 50,
}

export const layoutTransition: Transition = {
  duration: 0.35,
  easings: 'easeInOut',
}
