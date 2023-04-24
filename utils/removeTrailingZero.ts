export function removeTrailingZero(value: string | number) {
  return String(value).replace(/\.?0+$/, '')
}
