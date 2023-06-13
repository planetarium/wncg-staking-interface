import Dropdown from 'components/Dropdown'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { MouseEvent } from 'react'
import { chainIdAtom } from 'states/system'

export default function GnbChainSelectDesktop() {
  const router = useRouter()
  const [chainId, setChainId] = useAtom(chainIdAtom)

  function onChainChange(e: MouseEvent<HTMLButtonElement>) {
    const { value } = e.currentTarget
    router.replace(router.pathname, `/wncg/${value}`, { shallow: true })
    setChainId(Number(value) as ChainId)
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
