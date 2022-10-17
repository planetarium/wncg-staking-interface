import { memo, useMemo } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'

import { usePool } from 'hooks'

import { StyledWncgPool } from './styled'
import Form from './Form'
import Header from './Header'
import Information from './Information'

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
  const { poolName } = usePool()

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
    <>
      <Head>
        <title>{poolName} / WNCG Staking</title>
      </Head>

      <StyledWncgPool {...poolProps} $isModal={isModal}>
        <div className="container">
          <div className="content">
            <Header />
            <Information />
            <Form />
          </div>

          <div className="sidebar">SIDEBAR</div>
        </div>
      </StyledWncgPool>
    </>
  )
}

export default memo(Pool)
