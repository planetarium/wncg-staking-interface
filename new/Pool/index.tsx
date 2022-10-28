import { memo, useCallback, useMemo, useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { usePool } from 'hooks'

import { StyledWncgPool } from './styled'
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

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      e.stopImmediatePropagation()
      if (!isModal || !modalRef.current) return
      if (!modalRef.current.contains(e.target as Node)) {
        router.replace('/wncg', undefined, { shallow: true })
      }
    },
    [isModal, router]
  )

  useMount(() => {
    if (isModal) {
      window.addEventListener('click', closeOnBlur)
    }
  })

  useUnmount(() => {
    if (isModal) {
      window.removeEventListener('click', closeOnBlur)
    }
  })

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

          <div className="right">SIDEBAR</div>
        </div>
      </StyledWncgPool>
    </>
  )
}

export default memo(Pool)
