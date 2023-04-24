import { memo } from 'react'

import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { useModal } from 'hooks'

import { StyledModalFailPage } from './styled'
import Button from 'components/Button'
import Lottie from 'components/Lottie'

type ModalFailPageProps = {
  action: string
  className?: string
  label?: string
  reason?: string
}

function ModalFailPage({
  action,
  className,
  reason: _reason,
  label = 'Close',
}: ModalFailPageProps) {
  const { removeModal } = useModal()
  const reason =
    _reason ||
    'Something is wrong with network connection.<br/> Please try again later.'

  return (
    <StyledModalFailPage {...MOTION} className={className} variants={fadeIn}>
      <header className="modalHeader">
        <Lottie className="lottie" animationData="fail" />
        <h2 className="title">{action} failed</h2>
        <p className="desc" dangerouslySetInnerHTML={{ __html: reason }}></p>
      </header>

      <footer className="modalFooter">
        <Button onClick={removeModal} $size="md">
          {label}
        </Button>
      </footer>
    </StyledModalFailPage>
  )
}

export default memo(ModalFailPage)
