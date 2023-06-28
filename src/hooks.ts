import { useState } from 'react'
import { convert } from './math'
import { LengthUnit, Field } from './utils'

type ConverterState = {
  leftField: { value: string; unit: LengthUnit }
  rightField: { value: string; unit: LengthUnit }
  boxDiv: { width: number; isMax: boolean }
}

const defaultConverterValues: ConverterState = {
  leftField: {
    value: '1',
    unit: LengthUnit.Inch
  },
  rightField: {
    value: '96',
    unit: LengthUnit.Pixel
  },
  boxDiv: { width: 96, isMax: false }
}

type BoxPadding = {
  minWidth: number
  minPadding: number
  maxPadding: number
}

const defaultBoxPadding = {
  minWidth: 640,
  minPadding: 24,
  maxPadding: 48
}

export const useConverterHook = (
  boxPadding: BoxPadding = defaultBoxPadding,
  initialState: ConverterState = defaultConverterValues
) => {
  const [fields, setFields] = useState(initialState)

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      setViewportWidth(window.innerWidth)
      // if (fields.boxDiv.width > maxWidth) {
      //   setFields({
      //     ...fields,
      //     boxDiv: { width: maxWidth, isMax: true }
      //   })
      // }
    })
  }

  const maxWidth =
    viewportWidth < boxPadding.minWidth
      ? viewportWidth - boxPadding.minPadding * 2
      : viewportWidth - boxPadding.maxPadding * 2

  // Handles value changes in the input fields
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

    const boxWidth =
      sourceUnit === LengthUnit.Pixel
        ? Number(inputValue)
        : Number(convert(inputValue, sourceUnit, LengthUnit.Pixel))
    const boxIsMax = boxWidth > maxWidth

    setFields({
      leftField: {
        ...leftField,
        value: updatedLeftVal
      },
      rightField: {
        ...rightField,
        value: updatedRightVal
      },
      boxDiv: { width: boxIsMax ? maxWidth : boxWidth, isMax: boxIsMax }
    })
  }

  // Handles unit changes in the dropdown select
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>, field: Field) => {
    const selectedUnit = e.target.value as LengthUnit

    const { leftField, rightField } = fields

    const isLeft = field === Field.Left // True is left, False is right

    if (rightField.unit === selectedUnit || leftField.unit === selectedUnit)
      setFields({
        ...fields,
        rightField: { ...leftField },
        leftField: { ...rightField }
      })
    else {
      const sourceField = isLeft ? leftField : rightField

      const updatedField = {
        value: convert(sourceField.value, sourceField.unit, selectedUnit),
        unit: selectedUnit
      }

      const [updatedLeftField, updatedRightField] = isLeft
        ? [updatedField, rightField]
        : [leftField, updatedField]

      setFields({
        ...fields,
        leftField: { ...updatedLeftField },
        rightField: { ...updatedRightField }
      })
    }
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
    },
    boxDiv: fields.boxDiv,
    maxWidth
  }
}
