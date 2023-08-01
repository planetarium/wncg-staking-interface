import { memo } from 'react'
import dynamic from 'next/dynamic'

import { useModal } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledUnstakeModalPage1 } from './styled'
import Button from 'components/Button'
import { CloseButton } from 'components/Modals/shared'
import Suspense from 'components/Suspense'
import Icon from 'components/Icon'
import Fallback from 'components/ExpectedRevenue/Fallback'

const ExpectedRevenue = dynamic(() => import('components/ExpectedRevenue'), {
  ssr: false,
})

type UnstakeModalPage1Props = {
  send: XstateSend
}

function UnstakeModalPage1({ send }: UnstakeModalPage1Props) {
  const { removeModal } = useModal()

  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  function goNext() {
    send('NEXT')
  }

  return (
    <StyledUnstakeModalPage1>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">
            <Icon icon="time" $size={16} />
            Estimated earnings
          </h2>
          <h3 className="subtitle">
            You&apos;ll get more rewards if you stay. Do you really want to
            withdraw?
          </h3>
        </div>

        <CloseButton />
      </header>

      <div className="container">
        <div className="modalContent">
          <Suspense fallback={<Fallback />}>
            <ExpectedRevenue amount={stakedTokenBalance} />
          </Suspense>
        </div>
      </div>

      <footer className="modalFooter">
        <div className="buttonGroup">
          <Button onClick={goNext} $variant="secondary" $size="md">
            Withdraw
          </Button>
          <Button onClick={removeModal} $size="md">
            Stay as is
          </Button>
        </div>
      </footer>
    </StyledUnstakeModalPage1>
  )
}

export default memo(UnstakeModalPage1)
