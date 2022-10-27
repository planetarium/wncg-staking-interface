import type { NumberFormatBaseProps } from 'react-number-format'

export function renderStrong(
  value: string,
  options: Partial<NumberFormatBaseProps> = {}
) {
  const { className, title } = options

  return (
    <strong className={className} title={title}>
      {value}
    </strong>
  )
}

export function renderTextOnly(value: string) {
  return <>{value}</>
}
