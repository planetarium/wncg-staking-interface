import FailPage from 'components/Modals/shared/FailPage'

export default function AddLiquidityModalPage3() {
  return (
    <FailPage
      action="Join pool"
      reason="Join pool transaction failed. Please try again."
    />
  )
}
