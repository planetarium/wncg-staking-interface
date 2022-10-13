// NOTE: https://github.com/MetaMask/jazzicon/blob/master/index.js
import Color from 'color'

export const colorRotate = (hex: string, degree: number) => {
  let hsl = Color(hex).hsl().array()
  let hue = hsl[0]
  hue = (hue + degree) % 360
  hue = hue < 0 ? 360 + hue : hue
  hsl[0] = hue

  return Color.hsl(...hsl).string()
}

export function convertAddressToNumber(address: string) {
  const addr = address.slice(2, 10)
  return parseInt(addr, 16)
}
