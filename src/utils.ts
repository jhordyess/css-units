export enum LengthUnit {
  Centimeter = 'cm',
  Millimeter = 'mm',
  QuarterMillimeter = 'q',
  Inch = 'in',
  Pica = 'pc',
  Point = 'point',
  Pixel = 'px'
}

export enum Field {
  Left,
  Right
}

// Utils

export const fixUnit = (unit: LengthUnit) => (unit === LengthUnit.Point ? 'pt' : unit)

export const LengthUnitArr = Object.entries(LengthUnit).map(([name, value]) => ({
  name,
  value,
  label: fixUnit(value)
}))
