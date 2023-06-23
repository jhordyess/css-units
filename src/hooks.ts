import { useState } from 'react'
import { convert } from './math'
import { LengthUnit, Field } from './utils'

type converterState = {
  leftField: { value: string; unit: LengthUnit }
  rightField: { value: string; unit: LengthUnit }
  rangeField: { value: string }
}

const defConverterVals: converterState = {
  leftField: {
    value: '96',
    unit: LengthUnit.Pixel
  },
  rightField: {
    value: '1',
    unit: LengthUnit.Inch
  },
  rangeField: { value: '96' }
}

export const useConverterHook = (initialState: converterState = defConverterVals) => {
  const [fields, setFields] = useState(initialState)

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
    const { value: inputValue } = e.target

    const isLeft = field === Field.Left // True is left, False is right

    const { leftField, rightField } = fields

    const [sourceUnit, targetUnit] = isLeft
      ? [leftField.unit, rightField.unit]
      : [rightField.unit, leftField.unit]

    const convertedValue = convert(inputValue, sourceUnit, targetUnit)

    const [updatedLeftVal, updatedRightVal] = isLeft
      ? [inputValue, convertedValue]
      : [convertedValue, inputValue]

    setFields(({ leftField, rightField, rangeField }) => ({
      leftField: {
        ...leftField,
        value: updatedLeftVal
      },
      rightField: {
        ...rightField,
        value: updatedRightVal
      },
      rangeField
    }))
  }

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>, field: Field) => {
    const selectedUnit = e.target.value as LengthUnit

    const { leftField, rightField } = fields

    const [isLeft, isOppositeField] =
      field === Field.Left
        ? [true, rightField.unit === selectedUnit]
        : [false, leftField.unit === selectedUnit] // True is left, False is right

    const [sourceValue, sourceUnit, targetUnit] = isLeft
      ? [
          leftField.value,
          isOppositeField ? rightField.unit : selectedUnit,
          isOppositeField ? leftField.unit : rightField.unit
        ]
      : [isOppositeField ? leftField.value : rightField.value, rightField.unit, selectedUnit]

    const updatedRightVal = convert(sourceValue, sourceUnit, targetUnit)

    const [updateLeftUnit, updateRightUnit] = isLeft
      ? [selectedUnit, isOppositeField ? leftField.unit : rightField.unit] //rightField.unit unnecessary to update
      : [isOppositeField ? rightField.unit : leftField.unit, selectedUnit] //leftField.unit unnecessary to update

    setFields(({ leftField, rightField, rangeField }) => ({
      leftField: {
        ...leftField,
        unit: updateLeftUnit
      },
      rightField: {
        ...rightField,
        unit: updateRightUnit,
        value: updatedRightVal
      },
      rangeField
    }))
  }

  return {
    leftField: {
      value: fields.leftField.value,
      handleValueChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleValueChange(e, Field.Left)
      },
      unit: fields.leftField.unit,
      handleUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleUnitChange(e, Field.Left)
      }
    },
    rightField: {
      value: fields.rightField.value,
      handleValueChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleValueChange(e, Field.Right)
      },
      unit: fields.rightField.unit,
      handleUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleUnitChange(e, Field.Right)
      }
    }
  }
}
