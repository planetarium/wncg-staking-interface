import { memo, Suspense as ReactSuspense, SuspenseProps } from 'react'

import { useIsMounted } from 'hooks'

function Suspense({ children, fallback }: SuspenseProps) {
  const mounted = useIsMounted()

  return (
    <ReactSuspense fallback={fallback}>
      {mounted ? children : fallback}
    </ReactSuspense>
  )
}

export default memo(Suspense)
