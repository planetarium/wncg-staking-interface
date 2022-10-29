export type ColorHue =
  | 'primary'
  | 'error'
  | 'warning'
  | 'success'
  | 'blue'
  | 'green'
  | 'orange'
  | 'gray'
  | 'white'
  | 'black'

export type ColorScale =
  | 25
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900

export type BrandColor =
  | 'purple'
  | 'black'
  | 'green1'
  | 'green2'
  | 'green3'
  | 'blue'
  | 'yellow'
  | 'orange'

export type ProductColor = 'primary' | 'green' | 'blue' | 'orange'

export type GradientType = 1 | 2 | 3 | 4 | 5 | 6

const primary = {
  25: '#f9f4ff',
  50: '#f1eafc',
  100: '#ecdcff',
  200: '#e0c5ff',
  300: '#caa3ff',
  400: '#a370ff',
  500: '#8549ff',
  600: '#5d27d6',
  700: '#3b068d',
  800: '#210255',
  900: '#100536',
}

const error = {
  25: '#fffbfa',
  50: '#fef3f2',
  100: '#fee4e2',
  200: '#fecdca',
  300: '#fda29b',
  400: '#f97066',
  500: '#f04438',
  600: '#d92d20',
  700: '#b42318',
  800: '#912018',
  900: '#7a271a',
}

const warning = {
  25: '#fffcf5',
  50: '#fffaeb',
  100: '#fef0c7',
  200: '#fedf89',
  300: '#fec84b',
  400: '#fdb022',
  500: '#f79009',
  600: '#dc6803',
  700: '#b54708',
  800: '#93370d',
  900: '#7a2e0e',
}

const success = {
  25: '#f6fef9',
  50: '#ecfdf3',
  100: '#d1fadf',
  200: '#a6f4c5',
  300: '#6ce9a6',
  400: '#32d583',
  500: '#12b76a',
  600: '#039855',
  700: '#027a48',
  800: '#05603a',
  900: '#054f31',
}

const blue = {
  25: '#f5fcff',
  50: '#e3f4fb',
  100: '#d8f3ff',
  200: '#b5e8ff',
  300: '#8bceff',
  400: '#67bfff',
  500: '#38acff',
  600: '#157ca9',
  700: '#00577c',
  800: '#003c56',
  900: '#072634',
}

const green = {
  25: '#e4fffc',
  50: '#d9fffd',
  100: '#cbf8f3',
  200: '#bcfff8',
  300: '#94faef',
  400: '#63ede5',
  500: '#3ae7d4',
  600: '#02c6b4',
  700: '#01786d',
  800: '#03413b',
  900: '#012c27',
}

const orange = {
  25: '#fffaf8',
  50: '#fff4f1',
  100: '#ffe4de',
  200: '#ffd4cb',
  300: '#ffb7a7',
  400: '#ff9983',
  500: '#f06f67',
  600: '#b94d36',
  700: '#973a26',
  800: '#752918',
  900: '#531a0e',
}

const gray = {
  25: '#fcfcfd',
  50: '#f9fafb',
  100: '#f1f5f9',
  200: '#eaf0f7',
  300: '#c8d0df',
  400: '#b0b8c8',
  500: '#838b9b',
  600: '#475467',
  700: '#344054',
  800: '#152134',
  900: '#212322',
}

export const ethereum = '#6f97f8'
export const white = '#fff'
export const black = '#121212'

export const colors = {
  primary,
  error,
  warning,
  success,
  blue,
  green,
  orange,
  gray,
  white,
  black,
  ethereum,
}

export const gradients = {
  1: `linear-gradient(93.08deg, ${error[400]} 0%, ${primary[500]} 100%)`,
  2: `linear-gradient(90deg, ${primary[400]} 0%, ${primary[600]} 100%)`,
  3: `linear-gradient(70deg, ${primary[50]} 14%, ${primary[200]} 86%)`,
  4: `linear-gradient(90deg, #02c6b4 0%, ${blue[500]} 100%)`,
  5: `linear-gradient(275deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  `,
  6: `linear-gradient(115deg, #1e1c28 26%, #20282b 40%, #22262e 70%)`,
}
