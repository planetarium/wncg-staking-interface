import { useMemo } from 'react'
import ReactLottie, { LottieComponentProps } from 'lottie-react'
import clsx from 'clsx'

import { StyledLottie } from './styled'

import arrowDownAnimation from './animation-arrow-down.json'
import bellAnimation from './animation-bell.json'
import coinAnimation from './animation-coin.json'
import completedAnimation from './animation-completed.json'
import failAnimation from './animation-fail.json'
import errorAnimation from './animation-error.json'
import loadingAnimation from './animation-loading.json'
import pendingAnimation from './animation-pending.json'
import scrollAnimation from './animation-scroll.json'
import subscriptionAnimation from './animation-subscription.json'
import successAnimation from './animation-success.json'
import timerAnimation from './animation-timer.json'
import toastLoadingAnimation from './animation-toast-loading.json'

type LottieType =
  | 'arrowDown'
  | 'bell'
  | 'coin'
  | 'completed'
  | 'fail'
  | 'error'
  | 'loading'
  | 'pending'
  | 'scroll'
  | 'subscription'
  | 'success'
  | 'timer'
  | 'toastLoading'

type LottieProps = {
  animationData: LottieType
  className?: string
} & Omit<LottieComponentProps, 'animationData'>

export default function Lottie({
  className,
  animationData: _animationData,
  ...props
}: LottieProps) {
  const animationData = useMemo(() => {
    switch (_animationData) {
      case 'arrowDown':
        return arrowDownAnimation
      case 'bell':
        return bellAnimation
      case 'coin':
        return coinAnimation
      case 'completed':
        return completedAnimation
      case 'fail':
        return failAnimation
      case 'error':
        return errorAnimation
      case 'loading':
        return loadingAnimation
      case 'pending':
        return pendingAnimation
      case 'scroll':
        return scrollAnimation
      case 'subscription':
        return subscriptionAnimation
      case 'success':
        return successAnimation
      case 'timer':
        return timerAnimation
      case 'toastLoading':
        return toastLoadingAnimation

      default:
        return null
    }
  }, [_animationData])

  if (!animationData) return null

  const shouldLoop = _animationData !== 'completed' && _animationData !== 'fail'

  return (
    <StyledLottie className={clsx('lottie', className)} aria-hidden>
      <ReactLottie animationData={animationData} {...props} loop={shouldLoop} />
    </StyledLottie>
  )
}
