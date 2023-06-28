import { MouseEvent, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import { switchNetwork } from '@wagmi/core'
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
  closeMenu,
  list,
}: GnbChainSelectMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const routerChainId = Number(router.asPath.replace('/wncg/', '')) as ChainId

  const { chainId: currentChainId, setChainId } = useChain()

  const onSelectChain = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      const { value } = e.currentTarget
      const newChainId = Number(value) as ChainId
      const newPathname = `/wncg/${newChainId}`

      if (routerChainId === newChainId) return
      if (currentChainId === newChainId) return

      try {
        await switchNetwork({
          chainId: newChainId,
        })
        router.replace(router.pathname, newPathname, { shallow: true })
        setChainId?.(newChainId)
      } catch (error) {
        console.log(error)
      }

      closeMenu()
    },
    [closeMenu, currentChainId, router, routerChainId, setChainId]
  )

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
              className={clsx({ selected: item === currentChainId })}
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
