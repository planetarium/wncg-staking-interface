import { expect, describe, vi } from 'vitest'
import '@testing-library/jest-dom'
import * as React from 'react'

import { renderHook, waitFor } from '@testing-library/react'
import { useFetchTotalStaked } from 'hooks/queries/useFetchTotalStaked'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchTotalStaked } from 'lib/queries/fetchTotalStaked'

const queryClient = new QueryClient()
const wrapper = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

vi.mock('hooks/useChain', () => ({
  useChain: vi.fn(() => ({
    chainId: 1,
    stakingAddress: '0xc53b567a70db04e928fb96d6a417971aa88fda38',
  })),
}))

vi.mock('lib/queries/fetchTotalStaked')

describe('useFetchTotalStaked', () => {
  it('should refetch on window focus', async () => {
    fetchTotalStaked.mockImplementation(() => Promise.resolve('10'))

    renderHook(() => useFetchTotalStaked({ refetchOnWindowFocus: 'always' }), {
      wrapper,
    })

    await waitFor(() => {
      console.log(fetchTotalStaked.mock.calls.length)
      expect(fetchTotalStaked.mock.calls).toHaveLength(1)
    })

    await waitFor(() => {
      window.dispatchEvent(new Event('focus'))
      console.log(fetchTotalStaked.mock.calls.length)
      expect(fetchTotalStaked.mock.calls).toHaveLength(2)
    })

    await waitFor(() => {
      window.dispatchEvent(new Event('focus'))
      console.log(fetchTotalStaked.mock.calls.length)
      expect(fetchTotalStaked.mock.calls).toHaveLength(3)
    })
  })
})
