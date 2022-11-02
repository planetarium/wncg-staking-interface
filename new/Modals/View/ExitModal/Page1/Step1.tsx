import { Control, Controller } from 'react-hook-form'
import clsx from 'clsx'

import { configService } from 'services/config'
import { getTokenSymbol } from 'utils/token'
import { usePool } from 'hooks'
import { ExitFormFields } from '../useExitForm'

import { StyledExitModalPage1Step1 } from './styled'
import TokenIcon from 'new/TokenIcon'

type ExitModalPage1Step1Props = {
  control: Control<ExitFormFields, 'any'>
  disabled: boolean
  exitType: string
  resetInputs(): void
}

function ExitModalPage1Step1({
  control,
  disabled,
  exitType,
  resetInputs,
}: ExitModalPage1Step1Props) {
  const { poolTokenAddresses } = usePool()
  const tokensList = [
    'all',
    ...poolTokenAddresses,
    configService.nativeAssetAddress,
  ]

  const rules = {
    required: true,
    onChange() {
      resetInputs()
    },
  }

  return (
    <StyledExitModalPage1Step1 $disabled={disabled}>
      <header className="header">
        <span className="count">1</span>
        <h4 className="title">Choose a coin to exit pool</h4>
      </header>

      <fieldset className="tokenGroup">
        <Controller
          name="exitType"
          control={control}
          rules={rules}
          render={({ field }) => (
            <>
              {tokensList.map((address) => {
                const key = `exitType:${address}`

                return (
                  <div
                    className={clsx('tokenButton', {
                      selected: exitType === address,
                    })}
                    key={key}
                  >
                    <input
                      {...field}
                      id={key}
                      type="radio"
                      value={address}
                      defaultChecked={exitType === address}
                    />

                    <label className="fakeInput" htmlFor={key}>
                      <TokenIcon address={address} $size={24} />
                      <span className="label">
                        {getTokenSymbol(address) || 'All'}
                      </span>
                    </label>
                  </div>
                )
              })}
            </>
          )}
        />
      </fieldset>
    </StyledExitModalPage1Step1>
  )
}

export default ExitModalPage1Step1
