import { MouseEvent } from 'react'

import { configService } from 'services/config'
import { useAccount, useAllowances, usePool, useStaking } from 'hooks'
import Button from 'components/Button'
import { atom, useAtom } from 'jotai'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { networkChainId } from 'utils/network'
import { findAbiFromErc20 } from 'utils/wagmi'

const tokenAtom = atom('')
const spenderAtom = atom('')

function WncgRevoke() {
  const { account } = useAccount()
  const { allowanceFor } = useAllowances()
  const { stakedTokenAddress } = useStaking()
  const { poolTokenAddresses, poolTokenSymbols } = usePool()

  const [token, setToken] = useAtom(tokenAtom)
  const [spender, setSpender] = useAtom(spenderAtom)

  const name = ['LP Token', ...poolTokenSymbols]
  const tokens = [stakedTokenAddress, ...poolTokenAddresses]
  const spenders = [
    configService.stakingAddress,
    configService.vaultAddress,
    configService.vaultAddress,
  ]

  const { config } = usePrepareContractWrite({
    address: token,
    abi: findAbiFromErc20('approve'),
    chainId: networkChainId,
    functionName: 'approve',
    args: [spender, '0'],
    enabled: !!token && !!account,
  })
  const { writeAsync } = useContractWrite(config)

  const list = tokens.map((token, i) => allowanceFor(token, spenders[i]))

  async function revoke() {
    await writeAsync?.()
  }

  function handleRevoke(e: MouseEvent) {
    const index = Number((e.currentTarget as HTMLButtonElement).value)
    setToken(tokens[index])
    setSpender(spenders[index])

    setTimeout(() => {
      try {
        revoke()
      } catch (error) {
        console.log(error)
      }
    }, 0)
  }

  return (
    <div
      style={{
        display: 'flex',
        width: 400,
        minHeight: 600,
        margin: '0 auto',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {list.map((item, i) => {
        if (!item) return null
        return (
          <dl key={`allowance:${name[i]}:${i}`}>
            <div
              style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
            >
              <dt style={{ marginRight: 8 }}>{name[i]}</dt>
              <dd>
                <Button
                  type="button"
                  onClick={handleRevoke}
                  value={i}
                  $contain
                  $size="md"
                >
                  Revoke
                </Button>
              </dd>
            </div>
          </dl>
        )
      })}
    </div>
  )
}

export default WncgRevoke
