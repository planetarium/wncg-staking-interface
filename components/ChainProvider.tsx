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

// Custom wrapper component
export function ChainContextProvider({
  pageProps,
  children,
}: ChainContextProvider) {
  const [chainId, setChainId] = useState(pageProps.chainId)

  console.log('CHAIN ID > ', chainId)

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
