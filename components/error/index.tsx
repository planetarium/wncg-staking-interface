import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { MOTION, ANIMATION_MAP } from 'config/constants/motions'
import { parseEscapes } from 'utils/parseEscapes'
import { useResponsive } from 'hooks'

import { StyledErrorPage } from './styled'
import Button from 'components/Button'
import Lottie from 'components/Lottie'

type ErrorProps = {
  code: number
}

export default function Error({ code }: ErrorProps) {
  const router = useRouter()
  const { isHandheld } = useResponsive()

  const subtitle = useMemo(
    () => (code === 404 ? 'Page not found' : 'Internal server error'),
    [code]
  )
  const desc = useMemo(
    () =>
      code === 404
        ? `This page you are looking for might have been removed, its name has changed or is temporarily unavailable.`
        : `Sorry, something went wrong :(\nThe server encountered an error and could not complete your request.`,
    [code]
  )

  const $size = isHandheld ? 'md' : 'lg'

  return (
    <StyledErrorPage>
      <div className="container">
        <motion.div
          {...MOTION}
          className="left"
          variants={ANIMATION_MAP.fadeIn}
          transition={{ duration: 1 }}
        >
          <Lottie animationData="error" />
        </motion.div>

        <motion.div className="right" transition={{ staggerChildren: 0.5 }}>
          <h1 className="title">{code} Error</h1>

          <h3 className="subtitle">{subtitle}</h3>

          <p
            className="desc"
            dangerouslySetInnerHTML={{
              __html: parseEscapes(desc).join('<br/>'),
            }}
          />

          <Button className="mainButton" href="/" $contain $size={$size}>
            Go to main
          </Button>
        </motion.div>
      </div>
    </StyledErrorPage>
  )
}
