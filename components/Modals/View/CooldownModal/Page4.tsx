import FailPage from 'components/Modals/shared/FailPage'

export default function CooldownModalPage3() {
  return (
    <FailPage
      action="Cooldown"
      reason="Cooldown transaction failed. Please try again."
    />
  )
}
