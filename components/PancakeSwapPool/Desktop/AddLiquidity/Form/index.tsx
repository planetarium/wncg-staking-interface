import { memo, useEffect } from 'react'

import { bnum } from 'utils/bnum'
import { wait } from 'utils/wait'
import { useAuth, useBalances, useStaking } from 'hooks'
import { useAddLiquidityForm, useAddLiquidityModal } from 'hooks/pancakeswap'

import { StyledAddLiquidityForm } from './styled'
import Arrow from './Arrow'
import Button from 'components/Button'
import { Checkout } from 'components/Modals/shared'
import OptimizeBanner from './OptimizeBanner'
import OptimizeError from './OptimizeError'
import Fieldset from './Fieldset'
import Summary from './Summary'
import Utils from './Utils'

function AddLiquidityForm() {
  const { account, prevAccount } = useAuth()
  const balanceOf = useBalances()
  const { lpToken } = useStaking()

  const addLiquidityReturns = useAddLiquidityForm()
  const {
    assets,
    activeField,
    fields,
    focusedElement,
    formState,
    optimized,
    amountsIn,
    optimize,
    resetFields,
    setFocusedElement,
    submitDisabled,
    amountsInFiatValueSum,
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

  return (
    <StyledAddLiquidityForm layoutRoot>
      <Utils
        optimize={optimize}
        optimized={optimized}
        focusedElement={focusedElement}
      />

      <OptimizeError
        activeField={activeField as 'TokenA' | 'TokenB' | null}
        fields={fields}
        formState={formState}
        focusedElement={focusedElement}
      />
      <OptimizeBanner focusedElement={focusedElement} optimized={optimized} />

      <Fieldset {...addLiquidityReturns} />

      <Arrow />

      <Summary
        active={!isEmpty}
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
