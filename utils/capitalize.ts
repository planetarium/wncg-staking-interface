export function capitalize(value: string) {
  return value
    .split(' ')
    .map((text) => `${text[0].toUpperCase()}${text.substring(1)}`)
    .join(' ')
}
