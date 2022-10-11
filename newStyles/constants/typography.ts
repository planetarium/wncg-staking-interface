export type TextStyle =
  | 'header'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'button'
  | 'display'

export const fontFamily = {
  display: "'Outfit', sans-serif",
  text: "'Inter', sans-serif",
}

const h1 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 96,
  lineHeight: '112px',
  letterSpacing: '-0.02em',
}

const h2 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 80,
  lineHeight: '104px',
  letterSpacing: '-0.02em',
}

const h3 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 64,
  lineHeight: '76px',
  letterSpacing: '-0.01em',
}

const h4 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 48,
  lineHeight: '60px',
  letterSpacing: '-0.005em',
}

const h5 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 32,
  lineHeight: '40px',
}

const h6 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 28,
  lineHeight: '36px',
}

export const title = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 24,
  lineHeight: '28px',
}

const subtitle1 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: '20',
  lineHeight: '24px',
}

const subtitle2 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 18,
  lineHeight: '21px',
}

const body1 = {
  fontFamily: fontFamily.text,
  fontSize: 18,
  lineHeight: '24px',
}

const body2 = {
  fontFamily: fontFamily.text,
  fontSize: 16,
  lineHeight: '24px',
}

const body3 = {
  fontFamily: fontFamily.text,
  fontSize: 14,
  lineHeight: '20px',
}

const body4 = {
  fontFamily: fontFamily.text,
  fontSize: 13,
  lineHeight: '18px',
}

export const caption = {
  fontFamily: fontFamily.text,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: '16px',
}

const button1 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 20,
  lineHeight: '24px',
  textAlign: 'center',
}

const button2 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 16,
  lineHeight: '24px',
  textAlign: 'center',
}

const button3 = {
  fontFamily: fontFamily.text,
  fontWeight: 700,
  fontSize: 14,
  lineHeight: '20px',
  textAlign: 'center',
}

const displayH1 = {
  fontFamily: fontFamily.display,
  fontWeight: 900,
  fontSize: 96,
  lineHeight: '112px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

const displayH2 = {
  fontFamily: fontFamily.display,
  fontWeight: 900,
  fontSize: 80,
  lineHeight: '104px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

const displayH3 = {
  fontFamily: fontFamily.display,
  fontWeight: 900,
  fontSize: 64,
  lineHeight: '76px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
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
}
