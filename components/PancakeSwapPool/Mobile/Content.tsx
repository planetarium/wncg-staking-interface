import { wait } from 'utils/wait'
import { useBalances, useStaking } from 'hooks'
import { useAddLiquidityModal } from 'hooks/pancakeswap'
import { UseAddLiquidityFormReturns } from 'hooks/pancakeswap/useAddLiquidityForm'
import { useFetchUserAllowances } from 'hooks/queries'

import { Footer, Summary } from 'components/PancakeSwapPool/shared'
import Form from './Form'

type PancakeSwapPoolMobileContentProps = UseAddLiquidityFormReturns

export default function PancakeSwapPoolMobileContent(
  props: PancakeSwapPoolMobileContentProps
) {
  const balanceOf = useBalances()
  const { lpToken } = useStaking()

  const { refetch } = useFetchUserAllowances()

  const {
    assets,
    amountsIn,
    resetFields,
    amountsInFiatValueSum,
    submitDisabled,
    setValue,
    watch,
    formState,
  } = props

  const _openJoin = useAddLiquidityModal(assets, amountsIn)

  async function openAddLiquidity() {
    refetch()
    await wait(50)

    _openJoin({
      assets,
      amountsIn,
      amountsInFiatValueSum,
      userLpAmount: balanceOf(lpToken.address),
      resetForm: resetFields,
    })
  }

  return (
    <>
      <div className="container">
        <div className="modalContent">
          <Form {...props} />

          <Summary
            amountsInFiatValueSum={amountsInFiatValueSum}
            setValue={setValue}
            watch={watch}
            formState={formState}
          />
        </div>
      </div>

      <Footer
        className="modalFooter"
        amountsInFiatValueSum={amountsInFiatValueSum}
        openJoin={openAddLiquidity}
        submitDisabled={submitDisabled}
      />
    </>
  )
}
