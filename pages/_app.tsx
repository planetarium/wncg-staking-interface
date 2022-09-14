import { useRef } from 'react'
import ReactGA from 'react-ga4'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useMount } from 'react-use'
import { RecoilRoot } from 'recoil'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { DefaultSeo } from 'next-seo'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/globals.scss'
import 'styles/toast.scss'

import { DEFAULT_SEO } from 'lib/seo'

import { CoingeckoAlert } from 'components/CoingeckoAlert'
import { GlobalFooter } from 'components/GlobalFooter'
import { Gnb } from 'components/Gnb'
import { Modal } from 'components/Modal'
import { NetworkAlert } from 'components/NetworkAlert'
import { ToastContainer } from 'components/ToastContainer'
import MediaQueryEffects from 'components/Effects/MediaQueryEffects'
import { ToastEffects } from 'components/Effects/ToastEffects'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = useRef(new QueryClient())

  useMount(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string)
  })

  return (
    <QueryClientProvider client={queryClient.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <RecoilRoot>
          <DefaultSeo {...DEFAULT_SEO} />
          <CoingeckoAlert />
          <NetworkAlert />
          <Gnb />
          <Component {...pageProps} />
          <ToastEffects />
          <Modal />
          <ToastContainer />
          <GlobalFooter />
          <MediaQueryEffects />
        </RecoilRoot>
      </Hydrate>
    </QueryClientProvider>
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
