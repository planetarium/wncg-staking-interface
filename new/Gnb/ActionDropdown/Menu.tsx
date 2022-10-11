import { memo, useCallback, useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import { motion } from 'framer-motion'
import styled from 'styled-components'

import { ModalCategory } from 'states/ui'
import {
  useBalances,
  useFiatCurrency,
  useModal,
  usePool,
  usePropAmounts,
  useStakedBalance,
} from 'hooks'

import { NumberFormat } from 'components/NumberFormat'
import { TokenIcon } from 'components/TokenIcon'

const StyledActionDropdownMenu = styled(motion.aside)`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  width: max-content;
  padding: 20px;
  color: black;
  background-color: #fff;

  hr {
    margin: 30px 0;
  }

  button {
    width: 100%;
    height: 40px;
    background-color: yellow;
  }
`

const motionVariants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
}

type ActionDropdownMenuProps = {
  close(): void
}

function ActionDropdownMenu({ close }: ActionDropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const { bptBalance } = useBalances()
  const { getBptFiatValue } = useFiatCurrency()
  const { addModal } = useModal()
  const { poolTokenSymbols } = usePool()
  const { propAmounts, propAmountsInFiatValue } = usePropAmounts()
  const { stakedBalance } = useStakedBalance()

  const bptBalanceInFiatValue = getBptFiatValue(bptBalance)
  const stakedBalanceInFiatValue = getBptFiatValue(stakedBalance)

  function withdraw() {
    addModal({
      category: ModalCategory.Withdraw,
    })
    close()
  }

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        close()
        window.removeEventListener('click', closeOnBlur)
      }
    },
    [close]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur)
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })

  return (
    <StyledActionDropdownMenu
      className="actionDropdownMenu"
      ref={menuRef}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={motionVariants}
    >
      <header>
        <h2>My Staked LP</h2>
        <p>
          <strong>
            <NumberFormat value={stakedBalance} decimalScale={4} />
          </strong>

          <NumberFormat
            value={stakedBalanceInFiatValue}
            prefix="$"
            decimalScale={2}
          />
        </p>
      </header>

      <button type="button" onClick={withdraw}>
        Withdraw
      </button>

      <hr />

      <header>
        <h2>Available Stakable LP</h2>
        <p>
          <strong>
            <NumberFormat value={bptBalance} decimalScale={4} />
          </strong>

          <NumberFormat
            value={bptBalanceInFiatValue}
            prefix="$"
            decimalScale={2}
          />
        </p>
      </header>

      <dl>
        {propAmounts.map((amount, i) => {
          const symbol = poolTokenSymbols[i]

          return (
            <div key={`${amount}-${symbol}`}>
              <dt>
                <TokenIcon symbol={symbol} />
                {symbol}
              </dt>
              <dd>
                <strong>
                  <NumberFormat value={amount} decimalScale={4} />
                </strong>
                /
                <NumberFormat
                  value={propAmountsInFiatValue[i]}
                  prefix="$"
                  decimalScale={2}
                />
              </dd>
            </div>
          )
        })}
      </dl>

      <button type="button">Exit pool</button>
    </StyledActionDropdownMenu>
  )
}

export default memo(ActionDropdownMenu)
