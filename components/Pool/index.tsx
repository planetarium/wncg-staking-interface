import { memo, useMemo, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { fadeIn } from 'constants/motionVariants'
import { usePool } from 'hooks'

import { StyledWncgPool, StyledPoolModalOverlay } from './styled'
import Balances from './Balances'
import Header from './Header'
import Information from './Information'
import Join from './Join'

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
  const modalRef = useRef<HTMLDivElement>(null)

  const { poolName } = usePool()
  const router = useRouter()

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
            ref: modalRef,
          }
        : {},
    [isModal]
  )

  function close() {
    router.replace('/wncg', undefined, { shallow: true })
  }

  return (
    <>
      <Head>
        <title>{poolName} / WNCG Staking</title>
      </Head>

      <StyledWncgPool {...poolProps} $isModal={isModal}>
        <div className="container">
          <div className="left">
            <Header />
            <Information />
            <Join />
          </div>

          <div className="right">
            <Balances />
          </div>
        </div>
      </StyledWncgPool>

      {isModal && (
        <StyledPoolModalOverlay
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
          onClick={close}
          role="button"
        />
      )}
    </>
  )
}

export default memo(Pool)
