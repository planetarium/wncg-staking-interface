import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from '../styles/HighPriceImpact.module.scss'

import { blockVariants } from 'components/home/constants'

import { Checkbox } from 'components/Checkbox'

type HighPriceImpactProps = {
  checked: boolean
  handleCheck(value: boolean): void
  required: boolean
}

function HighPriceImpact({
  checked,
  handleCheck,
  required,
}: HighPriceImpactProps) {
  return (
    <AnimatePresence>
      {required && (
        <motion.aside
          className={styles.highPriceImpact}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={blockVariants}
        >
          <Checkbox
            className={styles.checkbox}
            id="agreeHighPriceImpact"
            checked={checked}
            onChange={handleCheck}
          />
          <label htmlFor="agreeHighPriceImpact">
            I accept the high price impact from depositing single token amounts,
            moving the market price based on the depth of the market.
          </label>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default memo(HighPriceImpact)
