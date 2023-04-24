export function toEpoch(value: string | number | Date) {
  try {
    return new Date(value).getTime() / 1_000
  } catch {
    return 0
  }
}
