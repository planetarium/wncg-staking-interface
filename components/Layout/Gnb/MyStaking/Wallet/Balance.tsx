import { memo } from 'react'
import { useSetAtom } from 'jotai'

import { showMyStakingAtom } from 'states/ui'
import { ModalType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useBalances, useFiat, useModal, useStaking } from 'hooks'

import { StyledMyStakingWalletSection } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import PoolTokens from 'components/PoolTokens'

function WalletBalance() {
  const toFiat = useFiat()
  const { addModal } = useModal()
  const { stakedTokenAddress } = useStaking()

  const setShowMyStaking = useSetAtom(showMyStakingAtom)

  const balanceOf = useBalances()
  const bptBalance = balanceOf(stakedTokenAddress)

  const hasLpToken = bnum(bptBalance).gt(0)
  const exitDisabled = !hasLpToken

  const fiatValue = toFiat(bptBalance, stakedTokenAddress)

  function openExit() {
    setShowMyStaking(false)
    addModal({
      type: ModalType.Exit,
    })
  }

  return (
    <StyledMyStakingWalletSection>
      <header className="header">
        <h3 className="title">Stakable LP tokens</h3>
        <div className="amount">
          <CountUp value={bptBalance} />
          <NumberFormat value={fiatValue} type="fiat" />
        </div>
      </header>

      <div className="content">
        {hasLpToken && <PoolTokens bptBalance={bptBalance} />}

        <Button
          className="actionButton"
          type="button"
          disabled={exitDisabled}
          onClick={openExit}
          $size="md"
          $variant="secondary"
        >
          Exit pool
        </Button>
      </div>
    </StyledMyStakingWalletSection>
  )
}

export default memo(WalletBalance)
