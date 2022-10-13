import { fadeIn } from 'constants/motionVariants'
import { useAccount, useConnectWallets } from 'hooks'

import { StyledAccountConnect } from './styled'
import Button from 'new/Button'

function AccountConnect() {
  const { isConnected } = useAccount()
  const { connect } = useConnectWallets()

  const disabled = isConnected

  return (
    <StyledAccountConnect
      className="accountConnect"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
    >
      <Button
        onClick={connect}
        disabled={disabled}
        $size="md"
        $variant="primary"
      >
        Connect Wallet
      </Button>
    </StyledAccountConnect>
  )
}

export default AccountConnect
