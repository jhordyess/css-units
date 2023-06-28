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

export const rangeValues: {
  [key in LengthUnit]: { rangeMinStep: number; inputStep: number; factor: number }
} = {
  [LengthUnit.Centimeter]: {
    factor: 10,
    inputStep: 1,
    rangeMinStep: 1
  },
  [LengthUnit.Millimeter]: {
    factor: 10,
    inputStep: 10,
    rangeMinStep: 10
  },
  [LengthUnit.QuarterMillimeter]: {
    factor: 10,
    inputStep: 40,
    rangeMinStep: 40
  },
  [LengthUnit.Inch]: {
    factor: 8,
    inputStep: 0.5,
    rangeMinStep: 0.5
  },
  [LengthUnit.Pica]: {
    factor: 12,
    inputStep: 2,
    rangeMinStep: 4
  },
  [LengthUnit.Point]: {
    factor: 12,
    inputStep: 24,
    rangeMinStep: 48
  },
  [LengthUnit.Pixel]: {
    factor: 12,
    inputStep: 32,
    rangeMinStep: 64
  }
}
