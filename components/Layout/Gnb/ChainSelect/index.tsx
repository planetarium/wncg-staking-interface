import Dropdown from 'components/Dropdown'
import { useChain } from 'hooks'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect } from 'react'
import { chainIdAtom } from 'states/system'

export default function GnbChainSelectDesktop() {
  const router = useRouter()

  const [chainId, setChainId] = useAtom(chainIdAtom)

  function onChainChange(e: MouseEvent<HTMLButtonElement>) {
    const { value } = e.currentTarget

    router.push(`/wncg/${value}`)
  }

  return (
    <>
      <Dropdown
        id="network"
        value={String(chainId)}
        list={['1', '5', '56', '97']}
        onChange={onChainChange}
      />
    </>
  )
}
