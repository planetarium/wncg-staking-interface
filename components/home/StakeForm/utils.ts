export const approvalTooltips = ['Approve to stake', 'Approved']
export const stakeTooltips = ['Stake', 'Staked']

export function renderButtonLabel(isApproved: boolean, isLoading: boolean) {
  switch (true) {
    case isApproved && isLoading:
      return 'Staking'
    case isApproved && !isLoading:
      return 'Stake'
    case !isApproved && isLoading:
      return 'Approving'
    case !isApproved && !isLoading:
      return 'Approve to stake'
    default:
      return ''
  }
}
