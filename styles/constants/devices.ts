export type DeviceSizeType =
  | 'minMobile'
  | 'maxMobile'
  | 'minTablet'
  | 'maxTablet'
  | 'minSmLaptop'
  | 'maxSmLaptop'
  | 'minLaptop'
  | 'maxLaptop'
  | 'minDesktop'
  | 'maxDesktop'

export const sizes = {
  mobile: 375,
  tablet: 800,
  smLaptop: 1080,
  laptop: 1366,
  desktop: 1600,
}

export const devices: Record<DeviceSizeType, string> = {
  minMobile: `min-width: ${sizes.mobile}px`,
  maxMobile: `max-width: ${sizes.mobile - 1}px`,
  minTablet: `min-width: ${sizes.tablet}px`,
  maxTablet: `max-width: ${sizes.tablet - 1}px`,
  minSmLaptop: `min-width: ${sizes.smLaptop}px`,
  maxSmLaptop: `max-width: ${sizes.smLaptop - 1}px`,
  minLaptop: `min-width: ${sizes.laptop}px`,
  maxLaptop: `max-width: ${sizes.laptop - 1}px`,
  minDesktop: `min-width: ${sizes.desktop}px`,
  maxDesktop: `max-width: ${sizes.desktop - 1}px`,
} as const
