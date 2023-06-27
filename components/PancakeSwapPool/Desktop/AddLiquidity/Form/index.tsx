import { memo, useEffect } from 'react'
import { useUnmount } from 'react-use'

import { bnum } from 'utils/bnum'
import { wait } from 'utils/wait'
import { useAuth, useBalances, useStaking } from 'hooks'
import { useAddLiquidityForm, useAddLiquidityModal } from 'hooks/pancakeswap'

import { StyledAddLiquidityForm } from './styled'
import Button from 'components/Button'
import { Checkout } from 'components/Modals/shared'
import {
  Arrow,
  Fieldset,
  Summary,
  UnoptimizableAlert,
} from 'components/PancakeSwapPool/shared'
import Header from './Header'

function AddLiquidityForm() {
  const { account, prevAccount } = useAuth()
  const balanceOf = useBalances()
  const { lpToken } = useStaking()

  const addLiquidityReturns = useAddLiquidityForm()
  const {
    activeField,
    setActiveField,
    amountsIn,
    amountsInFiatValueSum,
    assets,
    focusedElement,
    maxBalances,
    optimize,
    optimized,
    optimizeDisabled,
    resetFields,
    setFocusedElement,
    submitDisabled,
  } = addLiquidityReturns

  const openAddLiquidity = useAddLiquidityModal(assets, amountsIn)

  const isEmpty = amountsIn.every((amt) => bnum(amt).isZero())

  async function onClickAddLiquidity() {
    await wait(50)

    openAddLiquidity({
      assets,
      amountsIn,
      amountsInFiatValueSum,
      userLpAmount: balanceOf(lpToken.address),
      resetForm: resetFields,
    })
  }

  useEffect(() => {
    if (account !== prevAccount) {
      resetFields()
      setFocusedElement(null)
    }
  }, [account, prevAccount, resetFields, setFocusedElement])

  useUnmount(() => {
    resetFields()
    setFocusedElement(null)
    setActiveField(null)
  })

  return (
    <StyledAddLiquidityForm layoutRoot>
      <Header
        optimize={optimize}
        optimized={optimized}
        focusedElement={focusedElement}
      />
      <UnoptimizableAlert
        activeField={activeField as 'TokenA' | 'TokenB' | null}
        assets={assets}
        focusedElement={focusedElement}
        maxBalances={maxBalances}
        optimizeDisabled={optimizeDisabled}
      />
      <Fieldset {...addLiquidityReturns} />
      <Arrow />
      <Summary
        active={!isEmpty}
        assets={assets}
        amountsInFiatValueSum={amountsInFiatValueSum}
      />
      <footer className="joinFormFooter">
        <Checkout
          amount={amountsInFiatValueSum}
          message="Join pool"
          type="fiat"
        />

        <Button
          onClick={onClickAddLiquidity}
          disabled={submitDisabled}
          $size="lg"
        >
          Join pool, get {lpToken?.symbol}
        </Button>
      </footer>
    </StyledAddLiquidityForm>
  )
}

export default memo(AddLiquidityForm)
