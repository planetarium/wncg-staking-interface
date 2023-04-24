import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import config from 'config'
import { slideInDown } from 'config/motionVariants'
import { txUrlFor } from 'utils/txUrlFor'
import { useResponsive } from 'hooks'

import { StyledPendingNotice } from './styled'
import Lottie from 'components/Lottie'
import Icon from 'components/Icon'

type PendingNoticeProps = {
  hash?: string
}

function PendingNotice({ hash }: PendingNoticeProps) {
  const { isHandheld } = useResponsive()
  const link = txUrlFor(hash)

  function openBscScan() {
    if (!link) return
    window.open(link)
  }

  return (
    <AnimatePresence>
      {hash && (
        <StyledPendingNotice
          className="pendingNotice"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
        >
          <Lottie className="lottie" animationData="loading" />

          <div className="content">
            <h4 className="title">Confirmation is in progress. Please wait.</h4>
            <p className="desc">
              Please don&apos;t leave the screen until we give you the
              completion sign.
            </p>
          </div>

          <button className="extLink" type="button" onClick={openBscScan}>
            <span className="explorer">
              {config.assetPlatform === 'ethereum' ? 'Etherscan' : 'BscScan'}
            </span>
            <Icon icon={isHandheld ? 'link' : 'outlink'} />
          </button>
        </StyledPendingNotice>
      )}
    </AnimatePresence>
  )
}

export default memo(PendingNotice)
