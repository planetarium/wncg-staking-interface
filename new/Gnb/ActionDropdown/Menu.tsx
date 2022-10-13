import { memo, useCallback, useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import { motion } from 'framer-motion'
import styled from 'styled-components'

import { ModalCategory } from 'states/ui'
import { slideInDown } from 'constants/motionVariants'
import { getTokenSymbol } from 'utils/token'
import {
  useBalances,
  useFiatCurrency,
  useModal,
  usePool,
  usePropAmounts,
  useStakedBalance,
} from 'hooks'

import Button from 'new/Button'
import NumberFormat from 'new/NumberFormat'
import TokenIcon from 'new/TokenIcon'

const StyledActionDropdownMenu = styled(motion.aside)`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  width: max-content;
  padding: 20px;
  color: black;
  background-color: var(--primary-50);

  hr {
    margin: 30px 0;
  }
`

type ActionDropdownMenuProps = {
  close(): void
}

function ActionDropdownMenu({ close }: ActionDropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const { bptBalance } = useBalances()
  const { getBptFiatValue } = useFiatCurrency()
  const { addModal } = useModal()
  const { poolTokenAddresses } = usePool()
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
      variants={slideInDown}
    >
      <header>
        <h2>My Staked LP</h2>
        <p>
          <strong>
            <NumberFormat value={stakedBalance} />
          </strong>

          <NumberFormat value={stakedBalanceInFiatValue} prefix="$" />
        </p>
      </header>

      <Button onClick={withdraw} leftIcon="coin" rightIcon="ether" $size="sm">
        Withdraw
      </Button>

      <Button onClick={withdraw} $variant="tiny">
        Withdraw
      </Button>

      <hr />

      <header>
        <h2>Available Stakable LP</h2>
        <p>
          <strong>
            <NumberFormat value={bptBalance} decimals={4} />
          </strong>

          <NumberFormat value={bptBalanceInFiatValue} prefix="$" decimals={2} />
        </p>
      </header>

      <dl>
        {propAmounts.map((amount, i) => {
          const address = poolTokenAddresses[i]
          const symbol = getTokenSymbol(address)

          return (
            <div key={`${amount}-${symbol}`}>
              <dt>
                <TokenIcon address={address} />
                {symbol}
              </dt>
              <dd>
                <strong>
                  <NumberFormat value={amount} decimals={4} />
                </strong>
                /
                <NumberFormat
                  value={propAmountsInFiatValue[i]}
                  prefix="$"
                  decimals={2}
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
