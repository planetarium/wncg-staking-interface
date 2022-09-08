export const motionVariants = {
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

export const blockVariants = {
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

export const migrationGuideVariants = {
  initial: {
    opacity: 0,
    y: '100%',
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: '100%',
  },
}

export const formTransition = {
  duration: 0.3,
  ease: 'easeOut',
}

export const sidebarTransition = {
  delay: 0.1,
  duration: 0.3,
  ease: 'easeOut',
}

export const migrationGuideTransitionDesktop = {
  type: 'spring',
  stiffness: 80,
  restDelta: 12,
  restSpeed: 0.35,
}

export const migrationGuideTransitionMobile = {
  type: 'spring',
  stiffness: 80,
  restDelta: 12,
  restSpeed: 0.5,
}

export const Tab = {
  Stake: 'TAB_STAKE',
  Unstake: 'TAB_UNSTAKE',
} as const
export type Tab = typeof Tab[keyof typeof Tab]

export const TabId = {
  Stake: 'TAB_ID_PANEL_STAKE',
  Unstake: 'TAB_ID_PANEL_UNSTAKE',
} as const
export const TabPanelId = {
  Stake: 'TAB_PANEL_ID_STAKE',
  Unstake: 'TAB_PANEL_ID_UNSTAKE',
} as const
