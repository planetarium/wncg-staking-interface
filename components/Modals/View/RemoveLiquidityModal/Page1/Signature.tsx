import { useCallback } from 'react'
import type { UseFormSetValue } from 'react-hook-form'
import { useAtomValue } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'

import { removeLiquidityTxAtom } from 'states/tx'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useSignature } from 'hooks/pancakeswap'

import { StyledRemoveLiquidityModalPage1Signature } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'

import type { RemoveLiquidityForm } from 'hooks/pancakeswap/useRemoveLiquidityForm'
import { RemoveLiquidityField } from 'config/constants'

type RemoveLiquidityModalPage1SignatureProps = {
  lpAmountOut: string
  setValue: UseFormSetValue<RemoveLiquidityForm>
  signature?: Signature
}

export default function RemoveLiquidityModalPage1Signature({
  lpAmountOut,
  setValue,
  signature,
}: RemoveLiquidityModalPage1SignatureProps) {
  const sign = useSignature()
  const tx = useAtomValue(removeLiquidityTxAtom)

  const onClickSign = useCallback(async () => {
    try {
      const sig = await sign(lpAmountOut)
      if (sig) {
        setValue(RemoveLiquidityField.Signature, sig)
      }
    } catch (error: any) {
      if (
        error.code === 'ACTION_REJECTED' ||
        error.code === 4001 ||
        error.error === 'Rejected by user'
      ) {
        return
      }

      throw error
    }
  }, [sign, lpAmountOut, setValue])

  const removeLiquidityDisabled = bnum(lpAmountOut).isZero()
  const disabled = !!signature || !!tx.hash

  return (
    <StyledRemoveLiquidityModalPage1Signature>
      <div className="formLabel">
        <span className="count">2</span>
        <label className="label">Sign to withdraw the selected amount</label>
      </div>

      <Button
        className="signButton"
        onClick={onClickSign}
        disabled={disabled || removeLiquidityDisabled}
        $size="md"
        $contain
      >
        <span className="label">{disabled ? 'Signed' : 'Sign'}</span>

        <AnimatePresence>
          {disabled && (
            <motion.div
              {...EXIT_MOTION}
              className="rightIcon"
              variants={ANIMATION_MAP.fadeIn}
            >
              <Icon icon="check" $size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </StyledRemoveLiquidityModalPage1Signature>
  )
}
