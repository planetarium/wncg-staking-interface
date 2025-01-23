import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import Link from 'next/link'

import { useChain, useClientMount } from 'hooks'
import { cooldownTxAtom } from 'states/tx'
import { txUrlFor } from 'utils/txUrlFor'
import { useWatch } from './useWatch'

import Icon from 'components/Icon'
import ToastStatus from './Status'
import { StyledToast } from './styled'

type CooldownToastProps = {
  hash: Hash
}

export default function CooldownToast({ hash }: CooldownToastProps) {
  const { chainId } = useChain()

  const setTx = useSetAtom(cooldownTxAtom)

  const status = useWatch(hash)

  useClientMount(() => {
    setTx(RESET)
  })

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(chainId, hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Cooldown started
            <Icon icon="outlink" />
          </h3>
          <ToastStatus status={status} />
        </Link>
      </header>
    </StyledToast>
  )
}
