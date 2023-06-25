import FailPage from 'components/Modals/shared/FailPage'

export default function RemoveLiquidityModalPage3() {
  return (
    <FailPage
      action="Exit pool"
      reason="Exit pool transaction failed. Please try again."
    />
  )
}
