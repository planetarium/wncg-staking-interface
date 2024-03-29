import { bnum } from 'utils/bnum'
import { wait } from 'utils/wait'
import { useBalances, useRefetch, useStaking } from 'hooks'
import { useAddLiquidityModal } from 'hooks/pancakeswap'
import type { UseAddLiquidityFormReturns } from 'hooks/pancakeswap/useAddLiquidityForm'

import { Arrow, Footer, Summary } from 'components/PancakeSwapPool/shared'
import Form from './Form'

type PancakeSwapPoolMobileContentProps = UseAddLiquidityFormReturns

export default function PancakeSwapPoolMobileContent(
  props: PancakeSwapPoolMobileContentProps
) {
  const balanceOf = useBalances()
  const { lpToken } = useStaking()

  const refetch = useRefetch({
    userAllowances: true,
  })

  const {
    assets,
    amountsIn,
    resetFields,
    amountsInFiatValueSum,
    submitDisabled,
  } = props

  const addLiquidity = useAddLiquidityModal(assets, amountsIn)
  const isEmpty = amountsIn.every((amt) => bnum(amt).isZero())

  async function openAddLiquidity() {
    refetch()
    await wait(50)

    addLiquidity({
      assets,
      amountsIn,
      amountsInFiatValueSum,
      userLpAmount: balanceOf(lpToken?.address),
      resetForm: resetFields,
    })
  }

  return (
    <>
      <div className="container">
        <div className="modalContent">
          <Form {...props} />
          <Arrow />
          <Summary
            assets={assets}
            active={!isEmpty}
            amountsInFiatValueSum={amountsInFiatValueSum}
          />
        </div>
      </div>

      <Footer
        className="modalFooter"
        amountsInFiatValueSum={amountsInFiatValueSum}
        openAddLiquidity={openAddLiquidity}
        submitDisabled={submitDisabled}
      />
    </>
  )
}
