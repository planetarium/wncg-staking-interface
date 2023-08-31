import { MouseEvent as ReactMouseEvent, RefObject } from 'react'
import { useSetAtom } from 'jotai'

import clsx from 'clsx'

import { slippageAtom } from 'states/system'
import {
  ANIMATION_MAP,
  EXIT_MOTION,
  TRANSITION_MAP,
} from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { wait } from 'utils/wait'
import { useCloseOnBlur } from 'hooks'
import { useSlippageForm, SLIPPAGE_TOLERANCES } from './useSlippageForm'

import { StyledSlippageControlMenu } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import Input from './Input'

type SlippageControlMenuProps = {
  closeMenu(): void
  menuRef: RefObject<HTMLUListElement>
}

function SlippageControlMenu({ closeMenu, menuRef }: SlippageControlMenuProps) {
  const setSlippage = useSetAtom(slippageAtom)
  const useFormReturns = useSlippageForm(closeMenu)
  const { slippageInput, reset, currentValue } = useFormReturns

  async function onSelectSlippage(e: ReactMouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    const newSlippage = bnum(e.currentTarget.value).toString() || null

    setSlippage(newSlippage)
    await wait(100)

    if (slippageInput) reset()

    closeMenu()
  }

  useCloseOnBlur(menuRef, closeMenu)

  return (
    <StyledSlippageControlMenu
      {...EXIT_MOTION}
      ref={menuRef}
      variants={ANIMATION_MAP.slideInDown}
      transition={TRANSITION_MAP.dropdown}
    >
      {SLIPPAGE_TOLERANCES.map((option) => {
        const selected = bnum(currentValue).eq(option)

        return (
          <li
            className={clsx('menuItem', { selected })}
            key={`slippageControlMenu:${option}`}
            role="option"
            aria-selected={selected}
          >
            <button
              type="button"
              onClick={onSelectSlippage}
              value={option}
              role="menuitem"
            >
              <NumberFormat
                value={option}
                decimals={1}
                maxDecimals={2}
                allowTrailingZeros
                suffix="%"
              />
              <Icon icon="check" />
            </button>
          </li>
        )
      })}

      <li>
        <Input {...useFormReturns} />
      </li>
    </StyledSlippageControlMenu>
  )
}

export default SlippageControlMenu
