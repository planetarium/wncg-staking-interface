import { build } from 'lib/queries/build'
import type { NextApiResponse, NextApiRequest } from 'next'

import { getQueryString } from 'utils/getQueryString'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const _chainId = getQueryString(req.query?.chainId)
  const chainId = Number(_chainId) as ChainId

  try {
    const data = await build(chainId)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: `Unable to fetch chain ${chainId}: ${error}`,
    })
  }
}
