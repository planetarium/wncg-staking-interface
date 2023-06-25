import { MouseEvent, memo } from 'react'
import { useSetAtom } from 'jotai'

import { showMyStakingAtom } from 'states/ui'
import { ModalType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useBalances, useChain, useFiat, useModal, useStaking } from 'hooks'

import { StyledMyStakingWalletSection } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import PoolTokens from 'components/PoolTokens'

function WalletBalance() {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { addModal } = useModal()
  const { lpToken } = useStaking()

  const setShowMyStaking = useSetAtom(showMyStakingAtom)

  const balanceOf = useBalances()
  const lpBalance = balanceOf(lpToken.address)

  const hasLpToken = bnum(lpBalance).gt(0)
  const exitDisabled = !hasLpToken

  const fiatValue = toFiat(lpBalance, lpToken.address)

  function onClickExit(e: MouseEvent) {
    e.stopPropagation()

    setShowMyStaking(false)
    addModal({
      type: chainId ? ModalType.RemoveLiquidity : ModalType.Exit,
    })
  }

  return (
    <StyledMyStakingWalletSection>
      <header className="header">
        <h3 className="title">Stakable LP tokens</h3>
        <div className="amount">
          <CountUp value={lpBalance} />
          {hasLpToken && <NumberFormat value={fiatValue} type="fiat" />}
        </div>
      </header>

      <div className="content">
        {hasLpToken && <PoolTokens lpBalance={lpBalance} />}

        <Button
          className="actionButton"
          type="button"
          disabled={exitDisabled}
          onClick={onClickExit}
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
