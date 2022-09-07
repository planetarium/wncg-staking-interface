import { motion } from 'framer-motion'
import styles from './style.module.scss'

import { parseTxError } from 'utils/error'

import { Icon } from 'components/Icon'

const motionVariants = {
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

const motionTransition = {
  ease: 'easeOut',
  duration: 0.25,
}

type PreviewWarningProps = {
  error?: any
  rektPriceImpact?: boolean
}

const REKT_PRICE_IMPACT_MESSAGE = {
  title: 'This price impact is too high. You cannot proceed.',
  message:
    "The likelyhood of you losing money is too high. For your protection, you can't perform this transaction on this interface.",
}

export function PreviewWarning({
  error,
  rektPriceImpact = false,
}: PreviewWarningProps) {
  const errorText = rektPriceImpact
    ? REKT_PRICE_IMPACT_MESSAGE
    : parseTxError(error)

  if (!errorText) return null

  return (
    <motion.aside
      className={styles.warning}
      key="previewWarning"
      variants={motionVariants}
      transition={motionTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h3>
        <Icon id="info" />
        {errorText.title}
      </h3>
      {errorText.message && <p>{errorText.message}</p>}
    </motion.aside>
  )
}
