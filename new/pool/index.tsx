import { memo, useMemo } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { StyledWncgPool } from './styled'

const motionVariants = {
  initial: {
    y: '100%',
  },
  animate: {
    y: 0,
  },
  exit: {
    y: '100%',
  },
}

const motionTransition = {
  ease: 'easeOut',
  duration: 0.5,
}

type PoolProps = {
  isModal?: boolean
}

function Pool({ isModal = false }: PoolProps) {
  const { pathname } = useRouter()

  const poolProps = useMemo(
    () =>
      isModal
        ? {
            as: motion.section,
            variants: motionVariants,
            initial: 'initial',
            animate: 'animate',
            exit: 'exit',
            transition: motionTransition,
          }
        : {},
    [isModal]
  )

  return (
    <StyledWncgPool {...poolProps} $isModal={isModal}>
      <div className="container">
        <div className="content">POOL PAGE</div>
        <div className="sidebar">SIDEBAR</div>
      </div>
    </StyledWncgPool>
  )
}

export default memo(Pool)
