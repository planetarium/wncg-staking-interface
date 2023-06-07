import { PropsWithChildren, useRef } from 'react'
import ReactGA from 'react-ga4'
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

import Effects from 'components/GlobalHooks'
import Layout from 'components/Layout'
import ToastContainer from 'components/ToastContainer'

type MyAppProps = AppProps & {
  pageProps: {
    dehydratedState: DehydratedState
  }
}

type HydrateAtomsProps = {
  queryClient: QueryClient
} & PropsWithChildren

function HydrateAtoms({ queryClient, children }: HydrateAtomsProps) {
  useHydrateAtoms([[queryClientAtom, queryClient]])
  return <>{children}</>
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          cacheTime: Infinity,
          suspense: true,
          keepPreviousData: true,
          refetchOnReconnect: true,
          useErrorBoundary(error: any) {
            return error.reason !== 'INVALID_ARGUMENT'
          },
        },
      },
    })
  )
  const isProd = config.env === 'production'

  useMount(() => {
    if (!isProd) return
    ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string)
  })

  useMount(() => {
    if (isFirefox) return document.body.classList.add('firefox')
    else {
      document.body.classList.add('notFirefox')
    }
  })

  return (
    <>
      {isProd && config.googleTagManager && (
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.googleTagManager}');`,
          }}
        />
      )}

      <QueryClientProvider client={queryClient.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <Provider>
            <HydrateAtoms queryClient={queryClient.current}>
              <WagmiConfig client={wagmiClient}>
                <GlobalStyle />
                <ToastStyle />

                <Layout>
                  <Component {...pageProps} />
                </Layout>

                <ToastContainer />
                <Effects />
                <ReactQueryDevtools />
              </WagmiConfig>
            </HydrateAtoms>
          </Provider>
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}

export default MyApp

export function reportWebVitals({ id, name, value }: NextWebVitalsMetric) {
  if (name === 'Next.js-hydration') return

  window?.gtag?.('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? value * 1_000 : value),
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  })
}
