import { MouseEvent, useRef } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { isEthereum } from 'utils/isEthereum'
import {
  ANIMATION_MAP,
  EXIT_MOTION,
  TRANSITION_MAP,
} from 'config/constants/motions'
import { getNetworkLabel } from 'utils/getNetworkLabel'
import { useChain, useCloseOnBlur } from 'hooks'

import { StyledGnbChainSelectMenu } from './styled'
import CryptoIcon from 'components/CryptoIcon'

type GnbChainSelectMenuProps = {
  closeMenu(): void
  list: ChainId[]
}

export default function GnbChainSelectMenu({
  list,
  closeMenu,
}: GnbChainSelectMenuProps) {
  const { chainId, setChainId } = useChain()
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  function onSelectChain(e: MouseEvent<HTMLButtonElement>) {
    const { value } = e.currentTarget
    const newPathname = `/wncg/${value}`

    if (newPathname !== router.pathname) {
      router.replace(router.pathname, `/wncg/${value}`, { shallow: true })

      const newChainId = Number(value) as ChainId
      setChainId?.(newChainId)
    }

    closeMenu()
  }

  useCloseOnBlur(menuRef, closeMenu)

  return (
    <StyledGnbChainSelectMenu
      ref={menuRef}
      {...EXIT_MOTION}
      variants={ANIMATION_MAP.slideInDown}
      transition={TRANSITION_MAP.dropdown}
    >
      <ul>
        {list.map((item) => {
          return (
            <li
              className={clsx({ selected: item === chainId })}
              key={`gnbChainSelectMenu:${item}`}
            >
              <button
                className="chainButton"
                value={item}
                onClick={onSelectChain}
              >
                <CryptoIcon
                  icon={isEthereum(item) ? 'ether' : 'bnb'}
                  $size={24}
                />
                {getNetworkLabel(item)}
              </button>
            </li>
          )
        })}
      </ul>
    </StyledGnbChainSelectMenu>
  )
}
