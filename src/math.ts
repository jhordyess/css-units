import { create, all, Fraction } from 'mathjs'
import { LengthUnit } from './utils'

//TODO improve bundle
const math = create(all)
math.createUnit({
  q: math.unit(math.fraction(1, 40), 'cm'),
  px: math.unit(math.fraction(1, 96), 'in'),
  pc: math.unit(math.fraction(1, 6), 'in'),
  point: math.unit(math.fraction(1, 72), 'in')
})
math.config({
  number: 'Fraction'
})

export const convert = (value: string, unit: LengthUnit, newUnit: LengthUnit): string => {
  return Number(value) > 0
    ? math
        .number(math.round(math.evaluate(`${value} ${unit} to ${newUnit}`).toNumeric(newUnit), 2))
        .toString()
    : '0'
}

export const defaultPPI = () => {
  math.createUnit('px', math.unit(math.fraction(1, 96), 'in'), { override: true })
}

export const updatePPI = (
  width: number,
  height: number,
  diagonal: string,
  diagonalUnit: LengthUnit.Inch | LengthUnit.Centimeter
): string => {
  let ppiStr: string = '96'
  try {
    if (!diagonal || !height || !width) throw new Error('Missing values')
    const fixDiagonal =
      diagonalUnit === LengthUnit.Inch
        ? diagonal
        : math.number(math.evaluate(`${diagonal} ${diagonalUnit} to in`).toNumeric('in'))
    const relation: Fraction = math.evaluate(`( ${width}^2 + ${height}^2 ) / ${fixDiagonal}^2`)
    const ppi = math.sqrt(math.number(relation)) || 96
    math.createUnit('px', math.unit(math.evaluate(`1 / ${ppi}`), 'in'), {
      override: true
    })
    ppiStr = math.round(ppi, 2).toString()
  } catch (error) {
    console.warn("Can't calculate PPI")
  } finally {
    return ppiStr
  }
}
