import { useState } from 'react'
import styles from './StakeWarningModal.module.scss'

import { ModalCategory } from 'app/states/modal'
import { getUnstakeStatus, UnstakeStatus } from 'app/states/unstake'
import { useAppSelector, useModal } from 'hooks'

import { Button } from 'components/Button'
import { Checkbox } from 'components/Checkbox'

type StakeWarningModalProps = {
  stake(): void
}

export function StakeWarningModal({ stake }: StakeWarningModalProps) {
  const [checked, setChecked] = useState(false)

  const { removeModal } = useModal()
  const status = useAppSelector(getUnstakeStatus)
  const isCoolingDown = status === UnstakeStatus.CooldownInProgress

  function handleCheck(value: boolean) {
    setChecked(value)
  }

  async function handleStake() {
    stake()
    removeModal(ModalCategory.StakeWarning)
  }

  return (
    <div className={styles.stakeWarningModal}>
      <h1 className={styles.title}>
        {isCoolingDown
          ? 'Cooldown will be extended'
          : 'You may go back to the cooldown status'}
      </h1>
      <p className={styles.desc}>
        {isCoolingDown
          ? 'You are now cooling down the staked assets. If you stake now, the cooldown timer will be extended, based on the weighted average of currently staked asset amount and newly staked asset amount.'
          : 'You are now in the withdrawal window. If you stake now, the cooldown timer will be updated using weighted average of currently staked asset amount and newly staked asset amount. Therefore, you may need to wait cooldown again to withdraw. If you want to withdraw the staked tokens right now, do not stake now and withdraw first.'}
      </p>
      <div className={styles.agreement}>
        <Checkbox
          className={styles.checkbox}
          id="agreement"
          variant="light"
          checked={checked}
          onChange={handleCheck}
        />
        <label htmlFor="agreement">I understand</label>
      </div>

      <Button size="large" disabled={!checked} onClick={handleStake} fullWidth>
        Stake
      </Button>
    </div>
  )
}
