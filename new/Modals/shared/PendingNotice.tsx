import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { slideInDown } from 'constants/motionVariants'
import { getTxUrl } from 'utils/url'

import { StyledPendingNotice } from './styled'
import SvgIcon from 'new/SvgIcon'

type PendingNoticeProps = {
  hash?: string
}

function PendingNotice({ hash }: PendingNoticeProps) {
  return (
    <AnimatePresence>
      {hash && (
        <StyledPendingNotice
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
          // transition={{ duration: 0.5, stiffness: 50 }}
        >
          <SvgIcon className="loading" icon="loading" $size={48} />

          <div className="content">
            <h4 className="title">Confirmation is in progress. Please wait</h4>
            <p className="desc">
              Please don&apos;t leave the screen until we give you the
              completion sign.
            </p>
          </div>
          <a
            className="extLink"
            href={getTxUrl(hash)}
            target="_blank"
            rel="noopener"
          >
            Etherscan
            <SvgIcon icon="link" $size={16} />
          </a>
        </StyledPendingNotice>
      )}
    </AnimatePresence>
  )
}

export default memo(PendingNotice)
