import { memo, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { optimizeErrorAtom } from 'states/form'
import { getTokenSymbol } from 'utils/token'

import Alert from './Alert'

type JoinFormNotOptimizableProps = {
  assets: string[]
  emptyBalances: boolean[]
}

function JoinFormNotOptimizable({
  assets,
  emptyBalances,
}: JoinFormNotOptimizableProps) {
  const showError = useAtomValue(optimizeErrorAtom)

  const disabled = useMemo(
    () => emptyBalances.some((item) => !!item),
    [emptyBalances]
  )

  const message = useMemo(() => {
    if (emptyBalances.every((item) => !!item)) return `Your balance is empty.`
    const tokenIndex = emptyBalances.findIndex((item) => !!item)
    const symbol = getTokenSymbol(assets[tokenIndex])
    return `Optimization is not possible because ${symbol} is 0.`
  }, [assets, emptyBalances])

  const show = disabled && showError

  return <Alert className="notOptimizable" show={show} message={message} />
}

export default memo(JoinFormNotOptimizable)
