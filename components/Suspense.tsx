import { Suspense as ReactSuspense, SuspenseProps } from 'react'

function Suspense({ children, fallback }: SuspenseProps) {
  return <ReactSuspense fallback={fallback}>{children}</ReactSuspense>
}

export default Suspense
