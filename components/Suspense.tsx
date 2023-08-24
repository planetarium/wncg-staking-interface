import { Suspense as ReactSuspense, SuspenseProps } from 'react'

import { useIsMounted } from 'hooks'

// FIXME: Suspense
function Suspense({ children, fallback }: SuspenseProps) {
  // const mounted = useIsMounted()

  return <ReactSuspense fallback={fallback}>{children}</ReactSuspense>
}

export default Suspense
