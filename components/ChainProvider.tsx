import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'
import { AppProps } from 'next/app'

import { ChainId } from 'config/chains'

const ChainContext = createContext<{
  chainId: ChainId | null
  setChainId: Dispatch<ChainId> | null
}>({
  chainId: null,
  setChainId: null,
})

type ChainContextProvider = {
  pageProps: AppProps['pageProps']
} & PropsWithChildren

// NOTE: Custom Context Provider
export function ChainContextProvider({
  pageProps,
  children,
}: ChainContextProvider) {
  const [chainId, setChainId] = useState(pageProps.chainId)

  return (
    <ChainContext.Provider value={{ chainId, setChainId }}>
      {children}
    </ChainContext.Provider>
  )
}

// Helper hook to access the context value
function useChainContext() {
  return useContext(ChainContext)
}

export { useChainContext, ChainContext }
