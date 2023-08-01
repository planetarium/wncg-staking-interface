import { UseFormSetValue } from 'react-hook-form'
import { useAtom } from 'jotai'

import { claimTxAtom } from 'states/tx'
import { isEthereum } from 'utils/isEthereum'
import { useChain } from 'hooks'
import { useClaim } from '../useClaim'
import { ClaimFormFields } from '../useClaimForm'

import { StyledClaimModalPage1 } from './styled'
import { Checkout, CloseButton, PendingNotice } from 'components/Modals/shared'
import TxButton from 'components/TxButton'
import Form from './Form'
import Summary from './Summary'

type ClaimModalPage1Props = {
  rewardList: boolean[]
  earnedTokenRewards: string[]
  send: XstateSend
  setValue: UseFormSetValue<ClaimFormFields>
  submitDisabled: boolean
  totalClaimFiatValue: string
}

export default function ClaimModalPage1({
  rewardList,
  earnedTokenRewards,
  send,
  setValue,
  submitDisabled,
  totalClaimFiatValue,
}: ClaimModalPage1Props) {
  const [tx, setTx] = useAtom(claimTxAtom)

  const { chainId } = useChain()

  const _claim = useClaim(rewardList, earnedTokenRewards)

  async function claim() {
    if (!_claim) {
      send('FAIL')
      return
    }

    try {
      const txHash = await _claim()
      if (!txHash) return
      setTx({
        hash: txHash,
        rewardList,
        earnedTokenRewards,
        totalClaimFiatValue,
      })
      send('NEXT')
    } catch (error: any) {
      if (
        error.code === 'ACTION_REJECTED' ||
        error.code === 4001 ||
        error.error === 'Rejected by user'
      ) {
        send('ROLLBACK')
        return
      }

      send('FAIL')
    }
  }

  const disabled = !!tx.hash

  return (
    <StyledClaimModalPage1 $disabled={disabled}>
      <header className="modalHeader">
        <strong className="title accent">Claim rewards</strong>
        <h2 className="subtitle">
          {isEthereum(chainId)
            ? 'Select the all coins to get rewards'
            : 'Claim to get rewards'}
        </h2>

        <CloseButton />
      </header>

      <div className="container">
        <div className="modalContent">
          <Form
            rewardList={rewardList}
            setValue={setValue}
            earnedTokenRewards={earnedTokenRewards}
            disabled={disabled}
          />
        </div>
      </div>

      <footer className="modalFooter">
        <Checkout
          amount={totalClaimFiatValue}
          message="You will get"
          type="fiat"
        />

        <TxButton onClick={claim} hash={tx.hash} disabled={submitDisabled}>
          Claim rewards
        </TxButton>
      </footer>

      <PendingNotice hash={tx.hash} />
    </StyledClaimModalPage1>
  )
}
