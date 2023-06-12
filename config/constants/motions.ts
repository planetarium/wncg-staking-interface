import type { Transition } from 'framer-motion'

export const EXIT_MOTION = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
}

export const MOTION = {
  initial: 'initial',
  animate: 'animate',
}

export const ANIMATION_MAP = {
  fadeIn: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  },

  slideInDown: {
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
  },

  slideInUp: {
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
  },

  slideInFromRight: {
    initial: {
      x: '100%',
    },
    animate: {
      x: 0,
    },
    exit: {
      x: '100%',
    },
  },

  appearInDown: {
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
  },

  appearInUp: {
    initial: {
      y: '100%',
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      y: '100%',
    },
  },

  popIn: {
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
  },

  popInCenter: {
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
  },
}

export const TRANSITION_MAP: Record<string, Transition> = {
  dropdown: {
    duration: 0.25,
    stiffness: 50,
  },

  layout: {
    duration: 0.35,
    easings: 'easeInOut',
  },

  modal: {
    ease: 'easeOut',
    duration: 0.5,
  },

  smooth: {
    duration: 0.5,
    stiffness: 50,
  },
}
