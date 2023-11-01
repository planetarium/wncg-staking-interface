import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { capitalize } from 'utils/capitalize'
import { useModal } from 'hooks'

import { StyledModalFailPage } from './styled'
import Button from 'components/Button'
import Lottie from 'components/Lottie'

type ModalFailPageProps = {
  action?: string
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

  const title = action ? `${capitalize(action)} failed` : 'Error'
  const reason =
    _reason ||
    'Something is wrong with network connection.<br/> Please try again later.'

  return (
    <StyledModalFailPage
      {...MOTION}
      className={className}
      variants={ANIMATION_MAP.fadeIn}
    >
      <header className="modalHeader">
        <Lottie className="lottie" animationData="fail" />
        <h2 className="title">{title}</h2>
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

export default ModalFailPage
