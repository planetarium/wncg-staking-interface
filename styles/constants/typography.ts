export type TextStyle =
  | 'header'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'button'
  | 'display'
  | 'number'

export const fontFamily = {
  display: "'Outfit', sans-serif",
  text: "'Inter', sans-serif",
  digit: "'Oswald', sans-serif",
}

const h1 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '6rem',
  lineHeight: 1.1666666666666667,
  letterSpacing: '-0.02em',
}

const h2 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '5rem',
  lineHeight: 1.3,
  letterSpacing: '-0.02em',
}

const h3 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '4rem',
  lineHeight: 1.1875,
  letterSpacing: '-0.01em',
}

const h4 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '3rem',
  lineHeight: 1.25,
  letterSpacing: '-0.005em',
}

const h5 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '2rem',
  lineHeight: 1.25,
}

const h6 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '1.75rem',
  lineHeight: 1.2857142857142858,
}

export const title = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '1.5rem',
  lineHeight: 1.1666666666666667,
}

const subtitle1 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '1.25rem',
  lineHeight: 1.2,
}

const subtitle2 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '1.125rem',
  lineHeight: 1.1666666666666667,
}

const body1 = {
  fontFamily: fontFamily.text,
  fontWeight: 500,
  fontSize: '1.125rem',
  lineHeight: 1.3333333333333333,
}

const body2 = {
  fontFamily: fontFamily.text,
  fontWeight: 500,
  fontSize: '1rem',
  lineHeight: 1.5,
}

const body3 = {
  fontFamily: fontFamily.text,
  fontWeight: 500,
  fontSize: '0.875rem',
  lineHeight: 1.4285714285714286,
}

const body4 = {
  fontFamily: fontFamily.text,
  fontWeight: 500,
  fontSize: '0.8125rem',
  lineHeight: 1.3846153846153846,
}

export const caption = {
  fontFamily: fontFamily.text,
  fontWeight: 500,
  fontSize: '0.75rem',
  lineHeight: 1.3333333333333333,
}

const button1 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '1.25rem',
  lineHeight: 1.2,
  textAlign: 'center',
}

const button2 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '1rem',
  lineHeight: 1.5,
  textAlign: 'center',
}

const button3 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '0.8125rem',
  lineHeight: 1.3846153846,
  textAlign: 'center',
}

const displayH1 = {
  fontFamily: fontFamily.display,
  fontWeight: 900,
  fontSize: '6rem',
  lineHeight: 1.1666666666666667,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

const displayH2 = {
  fontFamily: fontFamily.display,
  fontWeight: 900,
  fontSize: '5rem',
  lineHeight: 1.3,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

const displayH3 = {
  fontFamily: fontFamily.display,
  fontWeight: 900,
  fontSize: '4rem',
  lineHeight: 1.1875,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

const displayH4 = {
  fontFamily: fontFamily.display,
  fontWeight: 900,
  fontSize: '3rem',
  lineHeight: 1.0625,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

const displayH5 = {
  fontFamily: fontFamily.display,
  fontWeight: 900,
  fontSize: '2rem',
  lineHeight: 1.15625,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

export const number = {
  fontFamily: fontFamily.digit,
  fontWeight: 600,
  fontSize: '2.5rem',
  lineHeight: 1.5,
}

export const headers = {
  1: h1,
  2: h2,
  3: h3,
  4: h4,
  5: h5,
  6: h6,
}

export const subtitles = {
  1: subtitle1,
  2: subtitle2,
}

export const bodies = {
  1: body1,
  2: body2,
  3: body3,
  4: body4,
}

export const buttons = {
  1: button1,
  2: button2,
  3: button3,
}

export const displayHeaders = {
  1: displayH1,
  2: displayH2,
  3: displayH3,
  4: displayH4,
  5: displayH5,
}
