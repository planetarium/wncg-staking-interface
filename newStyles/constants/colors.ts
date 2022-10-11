export type ColorHue =
  | 'primary'
  | 'error'
  | 'warning'
  | 'success'
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

export type GradientType = 1 | 2 | 3 | 4

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

export const colors = {
  primary,
  error,
  warning,
  success,
  gray,
}

export const brandColors = {
  purple: '#352377',
  black: '#212322',
  green1: '#b2e2bb',
  green2: '#4ea199',
  green3: '#377588',
  blue: '#53acd3',
  yellow: '#ebb077',
  orange: '#ea766f',
}

export const productColors = {
  primary: '#8549ff',
  green: '#3ae7d4',
  blue: '#38acff',
  orange: '#ea766f',
}

export const gradients = {
  1: `linear-gradient(93.08deg, ${error[400]} 0%, ${productColors.primary} 100%)`,
  2: `linear-gradient(90deg, ${primary[400]} 0%, ${primary[600]} 100%)`,
  3: `linear-gradient(68.42deg, ${primary[50]} 14.17%, ${primary[200]} 85.83%)`,
  4: `linear-gradient(90deg, #02c6b4 0%, ${productColors.blue} 100%)`,
}
