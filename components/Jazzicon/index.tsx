// NOTE: https://github.com/MetaMask/jazzicon/blob/master/index.js

import MersenneTwister from 'mersenne-twister'

import { colors, shapeCount, svgns, wobble } from './constants'
import { colorRotate, convertAddressToNumber } from './utils'

import { Paper } from './Paper'

type JazziconProps = {
  address: string
  diameter?: number
  className?: string
}

type Colors = string[]

export function Jazzicon({ address, diameter = 32, className }: JazziconProps) {
  const seed = convertAddressToNumber(address)
  const generator = new MersenneTwister(seed)

  const genColor = (colors: Colors): string => {
    generator.random()
    const idx = Math.floor(colors.length * generator.random())
    const color = colors.splice(idx, 1)[0]
    return color
  }

  const hueShift = (colors: Colors): Colors => {
    const amount = generator.random() * 30 - wobble / 2
    return colors.map((hex) => colorRotate(hex, amount))
  }

  const genShape = (
    remainingColors: Colors,
    diameter: number,
    i: number,
    total: number
  ) => {
    const center = diameter / 2

    const firstRot = generator.random()
    const angle = Math.PI * 2 * firstRot
    const velocity =
      (diameter / total) * generator.random() + (i * diameter) / total

    const tx = Math.cos(angle) * velocity
    const ty = Math.sin(angle) * velocity

    const translate = `translate(${tx} ${ty})`

    const secondRot = generator.random()
    const rot = firstRot * 360 + secondRot * 180
    const rotate = `rotate(${rot.toFixed(1)} ${center} ${center})`

    const transform = `${translate} ${rotate}`
    const fill = genColor(remainingColors)

    return (
      <rect
        key={i}
        x="0"
        y="0"
        rx="0"
        ry="0"
        width={diameter}
        height={diameter}
        fill={fill}
        transform={transform}
      />
    )
  }

  const remainingColors = hueShift(colors.slice())
  const shapeArray = Array(shapeCount).fill(undefined)

  return (
    <Paper
      className={className}
      color={genColor(remainingColors)}
      diameter={diameter}
    >
      <svg xmlns={svgns} x="0" y="0" width={diameter} height={diameter}>
        {shapeArray.map((_, i) =>
          genShape(remainingColors, diameter, i, shapeCount - 1)
        )}
      </svg>
    </Paper>
  )
}
