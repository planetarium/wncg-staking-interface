import { PropsWithChildren, useRef } from 'react'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { isFirefox } from 'react-device-detect'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { DehydratedState } from '@tanstack/react-query'
import { useMount } from 'react-use'
import { Provider } from 'jotai'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Script from 'next/script'
import { WagmiConfig } from 'wagmi'
import { queryClientAtom } from 'jotai-tanstack-query'
import { useHydrateAtoms } from 'jotai/utils'
import 'react-toastify/dist/ReactToastify.css'

import config from 'config'
import wagmiClient from 'lib/wagmi/client'

import GlobalStyle from 'styles/GlobalStyle'
import ToastStyle from 'styles/ToastStyle'

import { ChainContextProvider } from 'components/ChainProvider'
import DefaultSeo from 'components/DefaultSeo'
import ErrorBoundary from 'components/ErrorBoundary'
import Layout from 'components/Layout'
import ToastContainer from 'components/ToastContainer'

type MyAppProps = AppProps & {
  pageProps: {
    dehydratedState: DehydratedState
    chainId: ChainId
    project: any
    prices: PriceMap
  }
}

type HydrateAtomsProps = {
  queryClient: QueryClient
  project: any
  prices: PriceMap
} & PropsWithChildren

function HydrateAtoms({ queryClient, children }: HydrateAtomsProps) {
  useHydrateAtoms([[queryClientAtom, queryClient]])
  return <>{children}</>
}

function MyApp({ Component, pageProps }: MyAppProps) {
  useMount(() => {
    wagmiClient.autoConnect()
  })

  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          suspense: true,
          staleTime: Infinity,
          cacheTime: Infinity,
          keepPreviousData: true,
          refetchOnReconnect: true,
          useErrorBoundary(error: any) {
            return error.reason !== 'INVALID_ARGUMENT'
          },
        },
      },
    })
  )

  useMount(() => {
    if (isFirefox) return document.body.classList.add('firefox')
    else {
      document.body.classList.add('notFirefox')
    }
  })

  return (
    <>
      {config.env === 'production' && config.googleTagManager && (
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.googleTagManager}');`,
          }}
        />
      )}

      <ErrorBoundary>
        <QueryClientProvider client={queryClient.current}>
          <Hydrate state={pageProps.dehydratedState}>
            <Provider>
              <HydrateAtoms
                queryClient={queryClient.current}
                project={pageProps.project}
                prices={pageProps.prices}
              >
                <WagmiConfig config={wagmiClient}>
                  <DefaultSeo />
                  <GlobalStyle />
                  <ToastStyle />

                  <ChainContextProvider pageProps={pageProps}>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>

                    <ToastContainer />
                  </ChainContextProvider>

                  <ReactQueryDevtools />
                </WagmiConfig>
              </HydrateAtoms>
            </Provider>
          </Hydrate>
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  )
}

export default MyApp
