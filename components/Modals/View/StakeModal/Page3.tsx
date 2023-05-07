import FailPage from 'components/Modals/shared/FailPage'

export default function StakeModalPage3() {
  return (
    <FailPage
      action="staking"
      reason="Staking transaction failed. Please try again."
    />
  )
}
