import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

import { REKT_PRICE_IMPACT } from 'config/constants/liquidityPool'
import { ANIMATION_MAP } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { isEthereum } from 'utils/isEthereum'
import { useChain, useResponsive } from 'hooks'

import { StyledRektPriceImpact } from './styled'
import Icon from 'components/Icon'

type RektPriceImpactProps = {
  action: 'join' | 'exit'
  priceImpact: string
  className?: string
  disabled?: boolean
}

function RektPriceImpact({
  action,
  priceImpact,
  className,
  disabled = false,
}: RektPriceImpactProps) {
  const { chainId } = useChain()
  const { isHandheld } = useResponsive()

  const show =
    isEthereum(chainId) && !disabled && bnum(priceImpact).gte(REKT_PRICE_IMPACT)

  const message =
    action === 'join'
      ? 'If the price impact exceeds 20%, join pool cannot be performed'
      : 'Slippage is too high. Please choose proportional withdrawal (price impact < 20%)'

  return (
    <AnimatePresence>
      {show && (
        <StyledRektPriceImpact
          className={clsx('rektPriceImpact', className)}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={ANIMATION_MAP.slideInDown}
          role="alert"
        >
          <Icon icon="warning" $size={isHandheld ? 16 : 24} />
          <h4 className="title">{message}</h4>
        </StyledRektPriceImpact>
      )}
    </AnimatePresence>
  )
}

export default RektPriceImpact
