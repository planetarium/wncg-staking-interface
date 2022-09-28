import styled from 'styled-components'
import { motion } from 'framer-motion'

import { truncateAddress } from 'utils/string'
import { useWeb3 } from 'hooks'

import { Jazzicon } from 'components/Jazzicon'

const StyledAccounMenu = styled(motion.aside)`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background-color: yellow;
  color: black;
`

const motionVariants = {
  initial: {
    opacity: 0,
    y: '-100%',
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: '-100%',
  },
}

type AccountMenuProps = {
  account: string
}

export function AccountMenu({ account }: AccountMenuProps) {
  const { disconnect } = useWeb3()

  return (
    <StyledAccounMenu
      initial="initial"
      animate="animate"
      exit="exit"
      variants={motionVariants}
    >
      <header>
        <h2>
          <Jazzicon address={account} />
          {truncateAddress(account, 6, 6)}
        </h2>
      </header>
      <button type="button" onClick={disconnect}>
        Disconnect
      </button>
    </StyledAccounMenu>
  )
}
