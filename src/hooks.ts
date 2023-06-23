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
  const [leftField, setLeftField] = useState(initialState.leftField)

  const [rightField, setRightField] = useState(initialState.rightField)

  const [rangeField, setRangeField] = useState(initialState.rangeField)

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
    const { value: inputValue } = e.target

    const isLeft = field === Field.Left // True is left, False is right

    const [sourceUnit, targetUnit] = isLeft
      ? [leftField.unit, rightField.unit]
      : [rightField.unit, leftField.unit]

    const convertedValue = convert(inputValue, sourceUnit, targetUnit)

    setLeftField(prev => ({
      ...prev,
      value: isLeft ? inputValue : convertedValue
    }))

    setRightField(prev => ({
      ...prev,
      value: isLeft ? convertedValue : inputValue
    }))
  }

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>, field: Field) => {
    const selectedUnit = e.target.value as LengthUnit

    if (field === Field.Left) {
      const isRightUnit = rightField.unit === selectedUnit

      const convertedValue = convert(
        leftField.value,
        isRightUnit ? rightField.unit : selectedUnit,
        isRightUnit ? leftField.unit : rightField.unit
      )

      setRightField(prev => ({
        ...prev,
        value: convertedValue,
        unit: isRightUnit ? leftField.unit : rightField.unit // lengthRight.unit unnecessary
      }))

      setLeftField(prev => ({
        ...prev,
        unit: selectedUnit
      }))
    } else if (field === Field.Right) {
      const isLeftUnit = leftField.unit === selectedUnit

      const convertedValue = convert(
        isLeftUnit ? leftField.value : rightField.value,
        rightField.unit,
        selectedUnit
      )

      setLeftField(prev => ({
        ...prev,
        unit: isLeftUnit ? rightField.unit : leftField.unit // lengthLeft.unit unnecessary
      }))

      setRightField(prev => ({
        ...prev,
        value: convertedValue,
        unit: selectedUnit
      }))
    }
  }

  return {
    leftField: {
      value: leftField.value,
      handleValueChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleValueChange(e, Field.Left)
      },
      unit: leftField.unit,
      handleUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleUnitChange(e, Field.Left)
      }
    },
    rightField: {
      value: rightField.value,
      handleValueChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleValueChange(e, Field.Right)
      },
      unit: rightField.unit,
      handleUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleUnitChange(e, Field.Right)
      }
    }
  }
}
