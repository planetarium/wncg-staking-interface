import { NextApiRequest, NextApiResponse } from 'next'

import axios from 'lib/axios'
import { bnum } from 'utils/bnum'
import { calcApr } from 'utils/calcApr'
import { getQueryString } from 'utils/getQueryString'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const chainId = getQueryString(req.query.chainId)
  const totalStaked = getQueryString(req.query.totalStaked)

  try {
    if (!chainId) throw Error()
    if (!totalStaked || bnum(totalStaked).isNaN()) {
      throw Error()
    }

    const { data } = await axios.get(`/api/staking?chainId=${chainId}`)

    const { prices, rewardTokenAddresses, rewardEmissionsPerSec, lpToken } =
      data

    if (
      !prices ||
      !lpToken?.address ||
      !rewardTokenAddresses ||
      !rewardEmissionsPerSec
    ) {
      throw Error()
    }

    if (
      (rewardEmissionsPerSec as string[])?.some(
        (emission: string) => emission == null
      )
    ) {
      throw Error()
    }

    const rewardTokenPrices = (rewardTokenAddresses as string[]).map(
      (addr) => prices[addr]
    )

    if (rewardTokenPrices.some((price) => price == null)) throw Error()

    const totalStakedFiatValue = bnum(totalStaked)
      .times(prices?.[lpToken.address] ?? '0')
      .toString()

    const aprs = (rewardEmissionsPerSec as string[]).map(
      (emission, i) =>
        calcApr(
          emission,
          prices[rewardTokenAddresses[i]] ?? '0',
          totalStakedFiatValue
        ) ?? 0
    )

    res.status(200).json({ aprs })
  } catch (error) {
    res.status(500).json({ error })
  }
}
